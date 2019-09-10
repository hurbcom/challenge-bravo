'use-strict'

// carregando json com todas as moedas
const moedas = require("../../moedas.json");

// carregando biblioteca request
const request = require('request');

// início api para conversão de valores
 exports.get = (req, res, next) => {

  // variavel moeda de origem
  let from = req.params.from;
  // variavel moeda de destino
  let to = req.params.to;
  // variavel valor a ser convertido
  let amount = parseFloat(req.params.amount);
  // url de api de conversao de moedas e criptomoedas
  let url = 'https://api.cryptonator.com/api/ticker/'+from+'-'+to;

  // verifico se as moedas existem no json e o valor está preenchido
  if(moedas.hasOwnProperty(from) || moedas.hasOwnProperty(to) || amount){

    // requisição de api de conversao de moedas e criptomoedas
    request(url, function (error, response, body) {
      // conversao da resposta em objeto
      let resposta = JSON.parse(body);
      // conversao do valor
      let amount_convert = resposta['ticker']['price'] * amount;
      // resposta com os valores de origem e convertido
      res.json({'vl_original': amount, 'vl_convertido': amount_convert });
    });
  }
  // mensagem de erro caso falte algum parametro ou alguma das moedas não existam
  else {
    res.json({'Resposta':'Erro ao Excluir Moeda.'});
  }
 };


