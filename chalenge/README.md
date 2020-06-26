# Api para conversão de moedas
Tecnologias utilizadas: Typescript, Express, Nodejs, Sqlite, Swagger/OpenApi 3.0, Sequelize ORM
## converte as seguintes moedas
USD
BRL
EUR
BTC
ETH

## Como usar

#### Instalar as dependências do projeto
 - npm install
#### adicionar o ambiente
 - renomeie .env.example para .env 
 - renomeie .env.test.example para .env.test
#### Iniciar o projeto
 - npm start

## Possiveis problemas

Error: listen EADDRINUSE: address already in use :::3000

 - npm run free-port

## Quero reiniciar o banco

- npm run clear
- npm start

### Endpoints

Para mais informações acesse http://localhost:3000/api-docs

GET http://localhost:3000/
descrição: Endpoint de conversão de moedas
parametros:
from - moeda atual
to - moeda a converter
amount - quantidade da moeda atual
Exemplo de conversão: *?from=BTC&to=EUR&amount=123.45*

POST http://localhost:3000/create
descrição: Endpoint de criaçao de moeda
parametros:
name -  nome da moeda
value - valor de conversão baseado no dolar ex: 1.2
Exemplo de criação: ?name=GBP&value=0.81