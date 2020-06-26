
# Api para conversão de moedas

Tecnologias utilizadas: Typescript, Express, Nodejs, Sqlite, Swagger/OpenApi 3.0, Sequelize ORM, Mocha, Supertest e Chai

## converte as seguintes moedas

USD , BRL, EUR, BTC, ETH


## Como usar

#### Instalar as dependências do projeto

- npm install

#### adicionar o ambiente

- renomeie .env.example para .env

- renomeie .env.test.example para .env.test

#### Iniciar o projeto

- npm start

#### Testes

- npm test

## Possiveis problemas

  

ERROR: Dialect needs to be explicitly supplied as of v4.0.0

  
- Verifique se os arquivos .env e .env.test existem
 

Error: listen EADDRINUSE: address already in use :::3000

- npm run free-port

- Caso esteja pelo docker vai ter que parar o container docker stop $(docker  ps -aq)

## Quero reiniciar o banco

  -  npm run clear

- npm start

  

## Usando pelo Docker

  

## Criar a imagem

  docker build -t avaliacao_node:1.0 .
 

## Iniciar um container com a imagem

- docker run -ti -p 3000:3000 avaliacao_node:1.0

acessar http://localhost:3000 ou http://localhost:3000/api-docs

  

## Deletar todos os containers baseados na imagem (linux)

  

- docker ps -a | awk '{ print $1,$2 }' | grep avaliacao_node:1.0 | awk '{print $1 }' | xargs -I {} docker rm {}

  

## Deletar a imagem

  

- docker rmi avaliacao_node:1.0

  

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


name - nome da moeda


value - valor de conversão baseado no dolar ex: 1.2


Exemplo de criação: ?name=GBP&value=0.81




SWAGGER http://localhost:3000/api-docs