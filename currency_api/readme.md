### IMPORTANTE ####
Foi utilizado Cloud MongoDB, e para testar é necessário me informar o IP para liberar o acesso ao banco de dados.







Desafio: https://github.com/hurbcom/challenge-bravo



ENDPOINTS:


Informações básica sobre API:
[GET] http://localhost:8080/




Gerenciamento de moedas:

	Listar todas as moedas: [GET] http://localhost:8080/currency
	
	Cadastrar nova moeda: [POST] http://localhost:8080/currency - ex.: {"symbol": "SYM", "rate":1.5897}  OBS: O rate deve ser em ralação à 'USD', caso necessário utilize a API de conversão para pegar o valor de 'rate' ;-)
	
	Atualizar uma moeda: [PUT] http://localhost:8080/currency - ex.: {"symbol": "SYM", "rate":1.5897}
	
	Apagar uma moeda: [DELETE] http://localhost:8080/currency - ex.: {"symbol": "SYM"}



Converter valores de moedas:

[POST] http://localhost:8080/convert - ex.: {"from": "brl", "to": "usd", "value": 83.5}




COMANDOS:
cd 'raiz-do-projeto'
npm install
npm run dev