# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

  
## Problema
Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

 
A API deve converter entre as seguintes moedas:

- USD

- BRL

- EUR

- BTC

- ETH

  
  

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

  

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

  

Ex: `?from=BTC&to=EUR&amount=123.45`

  
  ## Solução Proposta
  
Foi desenvolvida uma API  em Node.JS, utilizando os frameworks: express, axios. Para buscar a cotação das moedas foi usada uma API externa desenvolvida pela Open Exchange Rates (https://openexchangerates.org/). Para usa-la é necessário uma chave de acesso. Essa chave já está disponível no arquivo .env. 

### Limitação
A API da Open Exchange Rates só é atualizada de hora em hora.


  ### Erros API
| Status | Mensagem | Descrição|
|--|--|--|
| 400|The to,from,amount parameters are required.|Quando está faltando algum parâmetro na query da requisição.|
| 401|Invalid currency in parameter \"to\".|Quando a moeda contida no "to" é invalida|
| 401|Invalid currency in parameter \"from\".|Quando a moeda contida no "from" é invalida|
| 401|amount must be numeric.|Quando o valor contido no "amount" não é numérico |

### Configuração de ambiente
Variáveis contidas no arquivo .env:
| Variável | Descrição |
|--|--|
| PORT | Porta aonde vai rodar a API desenvolvida. |
| OPENEXCHANGERATES_API | URL da API externa. |
| KEY_API  | Chave da API externa. |

### Rota

A API desenvolvida tem apenas uma rota. Essa rota contém os seguintes parâmetros obrigatórios: **from, to e amount.** Seu retorno é em formato json.
#### Requisição:

url: http://localhost:3000/api/rates?from=EUR&to=BRL&amount=1
Resposta:
```json
{
    "from": "EUR",
    "to": "BRL",
    "amount": "1",
    "result": "4.38"
}
```
## Execução

 - Clonar o projeto do  repositório 
	```sh
	git clone $seu-clone 
	```
- Acessar o projeto clonado
	```sh
	cd $clone
	```
### Sem Docker
- comando para instalar dependências
	```sh
	npm install
	```

- comando para executar a aplicação
	```sh
	npm start
	```

### Com Docker  

- comando para buildar e executar a aplicação no Docker
	```sh
	docker-compose up -d
	```
## Teste

Para desenvolver os testes automatizados, foram utilizados os frameworks: mocha e supertest.  E para o teste de estresse, foi utilizado o  artillery. O teste de estresse foi elaborado para fazer 1000 requisições por segundo.

###  Teste automatizados 
- Comando para rodar os testes
	```sh
	npm test
	```
- Resultado 
	 ```sh
	 GET /api/rates
	    √ respond with error in required parameters
	    √ respond with invalid currency in parameter "to"
	    √ respond with invalid currency in parameter "from"
	    √ respond that the parameter "amount" must be numeric.
	    √ respond to the converted currency.

  5 passing (55ms)
	```

###  Testes automatizados 
- Comando para rodar o teste de estresse ( O servidor deve estar rodando)
	```sh
  npm run stress-test
	```
- Resultado
 	```sh
  Summary report @ 15:03:36(-0200) 2018-12-01
  Scenarios launched:  1000
  Scenarios completed: 1000
  Requests completed:  1000
  RPS sent: 65.83
  Request latency:
    min: 461.7
    max: 913.9
    median: 502.5
    p95: 625.1
    p99: 796.1
  Scenario counts:
    0: 1000 (100%)
  Codes:
    200: 1000
	```
Boa sorte e boa viagem! ;)

  

<p  align="center">

<img  src="ca.jpg"  alt="Challange accepted" />

</p>