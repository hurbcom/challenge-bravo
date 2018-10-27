# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

  

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

  

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:

- JavaScript (NodeJS)

- Python

- Go

- Ruby

- C++

- PHP

  

Você pode usar qualquer _framework_. Se a sua escolha for por um _framework_ que resulte em _boilerplate code_, por favor assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.

  

## Arquitetura do Projeto

A API foi escrita utilizando a tecnologia Node.JS (Javascript :two_hearts:). Para servidor da aplicação foi utilizada a _framework_ Express.JS e para manter em cache as cotações atuais das moedas foi utilizado o Redis.

Foi utilizada uma API para recuperar e manter atualizada as cotações, a _openexchangerates_. Ela precisa de uma chave para ser utilizada, por isso eu estou disponibilizando a minha em um .env no diretório do projeto, que é gerenciado pelo pacote `dotenv`. Mas, a saber, a chave é `4ca36050e7d245008efefa40eabbd4d1`. 

Por uma limitação no plano gratuito da _openexchangerates_, a taxa de atualização de cotações é mantida de uma em uma hora, que é o que esse plano permite. Procurei pelos cantos claros e sombrios da internet (as páginas 1 e 2 do _Google_ respectivamente) e não achei outra API com um plano gratuito melhor que abrangesse todas as moedas requisitadas, então ¯\__(ツ)__/¯.

Para os testes automatizados, foi utilizada a _framework_ Mocha.JS em conjunto com a biblioteca Chai.JS. Para o teste de stress foi utilizada a _toolkit_ Artillery.   

## Instalando e Rodando  

Primeiramente é claro, vem o `git clone` e então vem os poréns.  A aplicação   espera um servidor redis rodando localmente na porta padrão, `6379`, ou então que seja configurada uma variável de ambiente `_REDIS_URL_`  com a URL de um servidor Redis em execução. Com isso, basta executar:  
```shell
cd clone-path
npm i
npm run start
```
Parece desnecessariamente complicado, não ? Eu sei, e por isso, seguindo a preferência eu escrevi um Dockerfile e um docker-compose para que você possa apenas se sentar e executar a API em um container Docker com: 
```shell
cd clone-path
docker-compose up -d
```
## Requisitanto para a API

A API recebe requisições com três parâmetros, "from", "to" e "amount" via _query_string_ conforme o exemplo da descrição do desafio. Ela valida a requisição e caso esteja tudo ok executa a conversão das moedas retornando um JSON com "from", "to", "amount" e "result", esse último contendo o valor da conversão realizada. Segue um exemplo de requisição e resposta: 
```shell
curl -i -H "Accept: application/json" -H "Content-Type:application/json" -X GET "http://localhost:6660/?from=USD&to=BRL&amount=1" 
```

``` json
{
    "from": "USD",
    "to": "BRL",
    "amount": "1",
    "result": 3.6425
}
```
Hoje é um bom dia para ganhar em dólar, em ? :smile:
Mas e se a requisição não estiver ok ? Nesse caso a API devolverá um JSON com  a _key_ "error" que contém uma mensagem associada ao problema, além de claro a requisição retornar com _status_ diferente de 200. 
Segue uma relação de status e mensagens devolvidas em caso de erro:

| status code   |  error message                          |
| ------------- | ------------------------------------------|
| 400           | Required params "from", "to" and "amount". Missing params {list of missing params}. |
| 400           | Request param "amount" need to be number. |
| 401           | Invalid currency in request param "from". Currencies currently accepted: USD,BRL,EUR,BTC,ETH |
| 401           | Invalid currency in request param "to". Currencies currently accepted: USD,BRL,EUR,BTC,ETH |
| 500           | Internal server error. |

## Testes
Todos os testes foram executados em um ambiente com a seguinte configuração:
```
Processador: Intel(R) Core(TM) i5-4210U CPU @ 1.70GHz
RAM: 6G DDR3
```

Durante o desenvolvimento foram estruturados scripts de testes que foram julgados necessários, com Mocha e Chai como dito anteriormente. Você pode utilizar esses scripts se fizer o processo descrito para rodar a aplicação localmente sem o container. Com a API online, basta rodar `npm run test` e os testes serão executados.
Já para o teste de stress, durante o desenvolvimento utilizei Artillery, obtendo algo sempre em torno dos seguintes resultados para 1000 requisições em um segundo: 

``` shell
Summary report @ 13:08:08(-0200) 2018-10-27
  Scenarios launched:  1000
  Scenarios completed: 1000
  Requests completed:  1000
  RPS sent: 283.29
  Request latency:
    min: 1.1
    max: 44
    median: 4.6
    p95: 9
    p99: 16.3
  Scenario counts:
    0: 1000 (100%)
  Codes:
    200: 1000
```
Caso esteja rodando a API localmente fora do container, pode utilizar `npm run stress-test` para usar meu script do Artillery e obter seus resultados.

<p  align="center">

<img  src="ca.jpg"  alt="Challange accepted" />

</p>