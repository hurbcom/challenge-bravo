const axios = require('axios');
const acess_key = '9cecea48371646d61189ede0ca752de4';
const coinsModel = require('../models/coinsModel');

//Exportando o método POST da rota para o router
exports.post = (req, res) => {
    let coin =  req.body.coin;

    setCoin(coin, res);
};

//Exportando o método DELETE da rota para o router
exports.delete = (req, res) => {
    let id =  req.query.id;
    
    deleteCoin(id, res);
};

//Exportando o método GET da rota para o router
exports.get = (req,res) => {
    getCoins(res);
};

//Função que verficia se a moeda é verdadeira e guarda no DBJSON
async function setCoin(coin, res) {
    try {
        
        //Busca em duas API's para verificar se a moeda é valida
        let respApi = await getCoinsFromApi1(res);
        let respApi2 = await getCoinsFromApi2(res);
        
        //Verifica se a moeda está listada em alguma das API's e se for verdadeiro chama o model para gravar
        if(findCoinInResults(respApi, coin) || findCoinInResults(respApi2, coin)){
            let respDB = await coinsModel.setCoin(coin);
           
            res.status(200).send({sucess: true});
        }

        //Se a moeda não for encontrada nas API's retorna que a moeda não foi encontrada
        if(!findCoinInResults(respApi, coin) && !findCoinInResults(respApi2, coin)){
            res.status(404).send({sucess: false, error: "Moeda não encontrada"});
        }

    } catch(error) {
        console.log("error", error);
        res.status(500).send({sucess: false, error : "Erro Inesperado"});
  }
}

//Função que delete a moeda do DBJSON
async function deleteCoin(id, res) {
    try {
        
        let respDB = await coinsModel.deleteCoin(id);

        res.status(200).send({sucess: true});

    } catch(error) {
        console.log("error", error);
        res.status(500).send({sucess: false, error : "Erro Inesperado"});
  }
}

//Função que busca as moedas cadastradas no DBJSON
async function getCoins(res) {
    try {
        let respDB = await coinsModel.getCoins();
        
        res.status(200).send(respDB);
    } catch(error) {
        console.log("error", error);
        res.status(500).send({sucess: false, error : "Erro Inesperado"});
  }
}

//Função que busca as moedas na primeira API
async function getCoinsFromApi1(res) {
    try {
        let resp = await axios.get('https://api.exchangerate-api.com/v4/latest/USD')
            .then((result) => {return result.data.rates;});
            
            return resp;
    } catch(error) {
        console.log("error", error);
        res.status(500).send({sucess: false, error : "Erro Inesperado"})
  }
}

//Função que busca as moedas na segunda API
async function getCoinsFromApi2(res) {
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