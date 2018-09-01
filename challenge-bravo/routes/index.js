var express = require('express');
var request = require('request');
var router = express.Router();
var app = express();
var http = require('http');

 
router.get('/convert', function(req, res, next) {
 //valor para conversao 		
  var amount = req.query.amount;

  //moeda de destino
  var to_coin = req.query.to;
  
  //moeda de origem
  var from_coin = req.query.from;

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
		var j = JSON.parse(body);
		converted_value = parseFloat(j[to_coin]);  			 //valor da moeda destino após conversão
		total_amount = converted_value * parseFloat(amount); //calculo total da conversão do valor informado

		var jsonData = {};
		jsonData["total_amount"] = total_amount;

     	res.send(jsonData) //retorna json com total da conversão
    });
});

module.exports = router;