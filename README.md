##Desenvolvimento

- Uso de Node.js e Express.js. 
- Uso de Bootstrap (Tema utilizado de https://colorlib.com/) 
- Uso do package loadtest para realizar testes de estresse
- Uso do package mocha para a realização dos testes unitários
- Utilização da API diponibilizada pelo cryptocompare (https://www.cryptocompare.com/) para consultar as cotações das moedas
  - exemplo de url => https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,USD,EUR,ETH
  - parâmetros => fsym  - moeda de origem
  				  tsyms - moeda(s) de destino 

##Sobre a API

Foi desenvolvida uma API que retorna em JSON conversões entre diferentes moedas (Ethereum, Dólar Americano, Real Brasileiro, Bitcoin e Euro). Foi criada também uma interface web para a realização dessa conversão, consome os dados retornados pela API criada e exibe o resultado final na tela.  

##Parâmetros enviados

Exemplo de url: http://localhost:3000/convert?from=USD&to=EUR&amount=123.45

 - from: moeda de origem;
 - to: moeda final;
 - amount: valor a ser convertido:



##Retorno da API

Ao ser chamada, a API retorna um JSON contendo o cálculo final da conversão, o valor convertido entre as moedas (por exemplo: 1 Bitcoin vale 6180.21 euros ), a moeda de origem e a moeda final. 

Exemplo caso de sucesso - STATUS 200 : retorna o valor final do cálculo

	GET http://localhost:3000/convert?amount=105&from=BRL&to=EUR

	{
	  "data": {
	    "total_amount": 648922.05,  // cálculo final
	    "converted_value": 6180.21, //valor convertido
	    "to": "Euro",				//moeda de origem
	    "from": "Bitcoin"			//moeda final
	    }
	}

Exemplo caso de erro - STATUS 500 : retorna mensagem de erro. 

	GET http://localhost:3000/convert?amount=105&from=BRL&to=EURdasd

	{
		"errorMessage":"There is no data for the symbol EURdasd ."
	}


 
##Comandos para execução da API
 - cd challenge-bravo/challenge-bravo
 - npm install
 - sudo docker-compose up --build
 - executar via browser
 	- Acessar localhost:3000 no browser
 	 	Exemplo de url: http://localhost:3000/convert?from=USD&to=EUR&amount=123.45

##Execução dos testes unitários

  - cd challenge-bravo/challenge-bravo/test
  - mocha
