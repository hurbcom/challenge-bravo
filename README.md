Documentação - API Cotações

Introdução

API desenvolvida com o objetivo de permitir a conversão de valores entre moedas de acordo com a paridade cadastrada para o período cotado.

Sobre a API

A API poderá ser consumida por qualquer tipo de aplicação. Ao ser chamada (request), a app origem deverá passar os seguintes parâmetros:

	• /:[moeda origem]/:[moeda destino]/:[valor a converter]
	
Onde:
	• Moeda Origem: . Moeda para a qual deseja converter o valor informado.
	• Moeda Destino: . Moeda que será convertida de acordo com o valor a ser cotado.
	• Valor a Converter: . Montante a ser convertido de acordo com a paridade entre a "moeda origem" e a "moeda destino".
	
Exemplo (Request):

	http://localhost:3000/cotacao/api/cotar/EUR/BRL/10000
	
A API devolverá (response) um objeto do tipo JSON, informando o valor convertido, indicando a cotação máxima e mínima para a data informada.

Exemplo (Response):

	{
"cotacaomax": 654900,
  "cotacaomin": 566100
}
	
Códigos de Status

	• Código 200 : OK - Estas requisição foi bem sucedida.
	• Código 204 : Não há conteúdo para enviar para esta solicitação.
	• Código 400 : Requisição Inválida.
	• Código 412 : Cabeçalhos pré-condições que o servidor não atende.
	• Código 500 : O servidor encontrou uma situação com a qual não sabe lidar.
	
GET

API para conversão de moedas

	• Request

	javascript - jQuery
	
	var settings = {
	  "url": "http://localhost:3000/cotacao/api/cotar/BRL/EUR/1000",
	  "method": "GET",
	  "timeout": 0,
	};
	 
	$.ajax(settings).done(function (response) {
	  console.log(response);
	});
	
	• Response
	
	Body
	
	Json:
	{
	  "cotacaomax": "",
	  "cotacaomin": ""
	}
	
	Headers:
	
	X-Powered-By 	Express
	Access-Control-Allow-Origin	*
	Content-Type	application/json; charset=utf-8
	Content-Length	33
	Etag	W/"21-DhNOgJAIh871bE9sknnmCzkUHMs"
	Date	Wed, 30 Jun 2021 11:53:42 GMT
	Connection	keep-alive
	Keep-Alive	timeout=5

