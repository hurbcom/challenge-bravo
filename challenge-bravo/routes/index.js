var express = require('express');
var request = require('request');
var router = express.Router();
var app = express();
var http = require('http');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {data: null });
});

 
router.get('/convert', function(req, res, next) {
 //valor para conversao 		
  var amount = req.query.amount;

  //moeda de destino
  var to_coin = req.query.to;
  
  //moeda de origem
  var from_coin = req.query.from;

  //parâmetro para identificar forma de retorno
  var isJson = req.query.isjson;
  if (isJson == "") {
    isJson = true; 
  }

  //caso o campo do valor não tenha sido preenchido, ele recebe o valor de 1
  if(amount===""){
  	amount = 1;
  }

  //Criação de um json com os reais nomes de cada moeda
  var jsonCoins = {};
  jsonCoins["ETH"] = 'Ethereum';
  jsonCoins["USD"] = 'Dólar Americano';
  jsonCoins["BRL"] = 'Real Brasileiro';
  jsonCoins["BTC"] = 'Bitcoin';
  jsonCoins["EUR"] = 'Euro';

  /*

  api utilizada => cryptocompare (https://www.cryptocompare.com/)
  exemplo de url => https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,USD,EUR,ETH
  parâmetros => fsym  - moeda de origem
  				tsyms - moeda(s) de destino 

  */

  //montagem da url
  var url_root = 'https://min-api.cryptocompare.com/data/price?';
  var url = url_root + 'fsym=' + from_coin + '&tsyms='+ to_coin;
  var total_amount = 0;
  var converted_value = 0; 

  //request da api cryptocompare (https://www.cryptocompare.com/)
	request(url, function (error, response, body) {
		var jsonData = {};

		var j = JSON.parse(body);
		converted_value = parseFloat(j[to_coin]);  			 //valor da moeda destino após conversão
		total_amount = converted_value * parseFloat(amount); //calculo total da conversão do valor informado

		jsonData["total_amount"] = total_amount.toFixed(2);
		jsonData["converted_value"] = converted_value;
		jsonData["to"] = jsonCoins[to_coin];
		jsonData["from"] = jsonCoins[from_coin];


    if(isJson){
   		res.send({data: jsonData});
    } else {  
   		res.render('index', {data: jsonData});
   	}
   
    });
});

module.exports = router;