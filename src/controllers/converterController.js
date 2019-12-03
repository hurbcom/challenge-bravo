const axios = require('axios');
const acess_key = '9cecea48371646d61189ede0ca752de4';
const coinsModel = require('../models/coinsModel');

//Exportando o método GET da rota para o router
exports.get = (req, res) => {
    let from =  req.query.from;
    let to = req.query.to;
    let amount = req.query.amount;
    
    if (typeof(from) != 'string' || from == undefined || 
            typeof(to) != 'string' || to == undefined || 
            isNaN(amount) || amount == undefined){
        res.status(422).send({sucess: false, error: "Parâmetros de entrada inválidos"});
        return;
    }
    
    getValue(from, to, amount, res);
};

//Função que realiza a conversão dos valores
async function getValue(from, to, amount, res) {
    try {

        let coinFromDB = await coinsModel.findCoin(from);
        let coinToDB = await coinsModel.findCoin(to);
        
        if (coinFromDB == undefined || coinToDB == undefined){
            res.status(404).send({sucess: false, error : "Moeda não cadastrada"});
            return;
        }

        //Busca em duas API's os valores reais e atualizados para maior quantidade de moedas
        let respApi = await getValuesFromApi1(res);
        let respApi2 = await getValuesFromApi2(res);
        
        //Verifica se o valor da moeda de origem (FROM) está no resultado da primeira API
        if(findCoinInResults(respApi, from)){
            valueFrominUSD = respApi[from];
            originFromAPI = 1;
        }

        //Verifica se o valor da moeda de origem (FROM) está no resultado da segunda API
        if(findCoinInResults(respApi2, from)){
            valueFrominUSD = respApi2[from];
            originFromAPI = 2;
        }

        //Verifica se o valor da moeda para retorno (TO) está no resultado da primeira API
        if(findCoinInResults(respApi, to)){
            valueToinUSD = respApi[to];
            originToAPI = 1;
        }

        //Verifica se o valor da moeda para retorno (TO) está no resultado da segunda API
        if(findCoinInResults(respApi2, to)){
            valueToinUSD = respApi2[to];
            originToAPI = 2;
        }
        
        //Regra para quando o valor da moeda de origem é MAIOR que a moeda final em USD
        if(valueToinUSD < valueFrominUSD){
            valueConverted = (amount * valueFrominUSD) * valueToinUSD;
        }
        
        //Regra para quando o valor da moeda de origem é MENOR que a moeda final em USD
        if(valueFrominUSD < valueToinUSD){
            valueConverted = (amount/valueToinUSD) / valueFrominUSD;
        }

         //Regra para quando o valor da moeda de origem é MENOR que a moeda final em USD da API - 2
         if(valueFrominUSD < valueToinUSD && originToAPI == 2 && originFromAPI == 2){
            valueConverted = (valueFrominUSD/valueToinUSD) * amount;
        }

        //Regra para quando a moeda de saida for o USD e se a moeda de origem veio da API - 1
        if (valueFrominUSD == 1 && originToAPI == 1){
            valueConverted = (amount*valueToinUSD);
        }

        //Regra para quando a moeda de saida for o USD e se a moeda de origem veio da API - 1
        if (valueToinUSD == 1 && originFromAPI == 1){
            valueConverted = (amount/valueFrominUSD);
        }

        //Regra para quando a moeda de saida for o USD e se a moeda de origem veio da API - 2
        if (valueToinUSD == 1 && originFromAPI == 2){
            valueConverted = (amount*valueFrominUSD);
        }

        //Regra para quando as duas moedas tiverem a mesma cotação
        if (valueFrominUSD == valueToinUSD){
            valueConverted = parseFloat(amount);
        }
        
        //Retornando com status 200
        res.status(200).send({sucess: true, value: valueConverted});
    } catch(error) {
        console.log("error", error);
        res.status(500).send({sucess: false, error : "Erro Inesperado"})
  }
}

//Função que busca os valores na primeira API
async function getValuesFromApi1(res) {
    try {
        let resp = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
            .then((result) => {return result.data.rates;});
            
            return resp;
    } catch(error) {
        console.log("error", error);
        res.status(500).send({sucess: false, error : "Erro Inesperado"})
  }
}

//Função que busca os valores na segunda API
async function getValuesFromApi2(res) {
    try {
        let resp2 = await axios.get('http://api.coinlayer.com/live?', {
            params: {
                access_key: acess_key,
            }}).then((result) => {return result.data.rates;});

            return resp2;
    } catch(error) {
        console.log("error", error);
        res.status(500).send({sucess: false, error : "Erro Inesperado"})
  }
}

//Função que verifica se a moeda existe no Objeto informado
function findCoinInResults(listOfResults, coin) {
    return listOfResults.hasOwnProperty(coin);
}