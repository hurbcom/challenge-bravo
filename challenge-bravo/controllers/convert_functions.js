var request = require('request');

/* Retorna os nomes reais das moedas usadas */ 
exports.get_coins_names = function() {
  var jsonCoins = {};
  jsonCoins["ETH"] = 'Ethereum';
  jsonCoins["USD"] = 'Dólar Americano';
  jsonCoins["BRL"] = 'Real Brasileiro';
  jsonCoins["BTC"] = 'Bitcoin';
  jsonCoins["EUR"] = 'Euro';

  return jsonCoins;
}


/*
Função criada para fazer o request da api escolhida para fazer as consultas 
das cotações 

api utilizada => cryptocompare (https://www.cryptocompare.com/)
exemplo de url => https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,USD,EUR,ETH
parâmetros => fsym  - moeda de origem
				tsyms - moeda(s) de destino 
*/

exports.get_quotes_convertion = function(amount, to_coin, from_coin, callback) {

  //montagem da url
  var url_root = 'https://min-api.cryptocompare.com/data/price?';
  var url = url_root + 'fsym=' + from_coin + '&tsyms='+ to_coin;


  //request da api cryptocompare (https://www.cryptocompare.com/)
	request(url, function (error, response, body) {

	    var jsonBody = JSON.parse(body);
	    var jsonData = {};

	    /* verifica se não há mensagem de erro no retorno vindo da API*/
	    if(jsonBody["Response"] == "Error"){
	      console.log(jsonBody["Message"]);
	      jsonData["errorMessage"] = jsonBody["Message"];
	      return callback(jsonData);
	    }

		jsonData = exports.convert_coin(jsonBody, amount, to_coin, from_coin);
   
   		return callback(jsonData);
    });
}


/* método que realiza o cálculo de conversão das moedas */
exports.convert_coin = function(json, amount, to_coin, from_coin) {

	//Criação de um json com os reais nomes de cada moeda
  	var jsonCoins = exports.get_coins_names();

	var converted_value = parseFloat(json[to_coin]);  			 //valor da moeda destino após conversão
	var total_amount = converted_value * parseFloat(amount); 	 //calculo total da conversão do valor informado
	var jsonData = {};

	jsonData["total_amount"] = total_amount.toFixed(2);			//limita a casa decimal em 2
	jsonData["converted_value"] = converted_value;
	jsonData["to"] = jsonCoins[to_coin];
	jsonData["from"] = jsonCoins[from_coin];

	return jsonData;
}

