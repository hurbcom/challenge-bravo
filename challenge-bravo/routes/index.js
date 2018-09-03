var express = require('express');
var request = require('request');
var router = express.Router();
var app = express();
var http = require('http');
var convert_func = require('../controllers/convert_functions');


/* GET home page. 
  direciona para a página web criada que mostra a conversão das moedas
*/
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

  //status da requisição
  var status = 200;

  //caso o campo do valor não tenha sido preenchido, ele recebe o valor de 1
  if(amount===""){
  	amount = 1;
  } else if (isNaN(amount)) {
    //caso o campo amount não esteja preenchido por números
    var msg = "Amount value is incorrect";
    status = 400;
    res.status(status).send({data: msg});
    return;
  }

  /*
    realiza o request para consulta da API e retorna o valor final, após o cálculo
  */
  convert_func.get_quotes_convertion(amount, to_coin, from_coin, function(val){
    var jsonData = val;

    /* altera o status de acordo com a mensagem retornada */
    status = 200; 

    if(jsonData["errorMessage"]){
      status = 400;
    } 

    res.status(status).send({data: jsonData});

    //res.render('index', {data: jsonData});
  });
   

});

module.exports = router;