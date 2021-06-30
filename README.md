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
	
	• Exemplo (Request):
http://localhost:3000/cotacao/api/cotar/EUR/BRL/10000
A API devolverá (response) um objeto do tipo JSON, informando o valor convertido, indicando a cotação máxima e mínima para a data informada.

	• Exemplo (Response):
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

API - Cotar Moedas

Exemplo | Request | Response - Cotar Moedas

Request

javascript - jQuery

var settings = {
  "url": "http://localhost:3000/cotacao/api/cotar/EUR/BRL/1000/25-06-2021%2018:56:39",
  "method": "GET",
  "timeout": 0,
};
 
$.ajax(settings).done(function (response) {
  console.log(response);
});


Response

json
{
  "cotacaomax": "",
  "cotacaomin": ""
}

API - Deletar Paridade

Exemplo | Request | Response - Deletar Paridade

Request

javascript - jQuery

var settings = {
  "url": "http://localhost:3000/cotacao/api/deletar/01-01-2000%2000:00:00/BRL/EUR",
  "method": "GET",
  "timeout": 0,
};
$.ajax(settings).done(function (response) {
  console.log(response);
});

Response

Json
{
  "Mensagem": "Moeda Deletada com Sucesso",
  "Moeda": []
}

API - Adicionar Paridade

Example | Request | Response - Adicionar Paridade

Request

javascript - jQuery
var settings = {
  "url": "http://localhost:3000/cotacao/api/adicionar/2021-06-59%2016:37:35/RRR/TTT/MOEDA%20TESTE%202/11/22",
  "method": "GET",
  "timeout": 0,
};
$.ajax(settings).done(function (response) {
  console.log(response);
});

Response

Json
{
  "Mensagem": "Moeda Cadastrada com Sucesso"
}

API - Update Paridade

Examplo

Request

javascript - jQuery

var settings = {
  "url": "http://localhost:3000/cotacao/api/alterar/2021-06-59%2016:37:35/RRR/TTT/MOEDA%20TESTE%202/11/223333",
  "method": "GET",
  "timeout": 0,
};
$.ajax(settings).done(function (response) {
  console.log(response);
});

Response

Json
{
  "Mensagem": "Moeda Alterada com sucesso",
  "Moeda": [
    {
      "data": "2021-06-59 16:37:35",
      "code": "RRR",
      "codein": "TTT",
      "name": "MOEDA TESTE 2",
      "high": "11",
      "low": "223333"
    }
   ]
}
