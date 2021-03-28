const repository = require('../repositories/popular-banco.repository');
const axios = require('axios');

const moedas = ['BRL', 'EUR', 'BTC', 'ETH']

const dataCotacao = [{}];

exports.get = async(req,res,next)=>{
    try {
    
     //antes de gravar os valores atualizados, deleta todas as documents do banco de dados
     await repository.delete();

    for(m of moedas){

      const infosMoeda = await getCotacaoMoeda(m);
      
      dataCotacao.push({'moeda':m, 'cotacaodolar':(1/infosMoeda[0]['high'])});
  
      await repository.get(
        {
            moeda: m,
            cotacaodolar: (1/infosMoeda[0]['high']),
       });

    }
  
        res.status(200).send({
            "metodo": "atualizacaoCotacoes",
            "resultado": "SUCESSO",
            "payload": dataCotacao 
        });

  } catch (e) {
     
    res.status(500).send({
        "metodo": "atualizacaoCotacoes",
        "resultado": "FALHA",
        "payload": dataCotacao 
    });

  }
};


const getCotacaoMoeda = async (value) => {
  try {
      const resp = await axios.get('https://economia.awesomeapi.com.br/json/'+value+'-USD');

      return resp.data;
  } catch (err) {
     

      console.error(err);
  }
};