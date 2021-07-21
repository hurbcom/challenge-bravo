# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=sos_pet_api&uri=https%3A%2F%2Fgithub.com%2FWallaceMachado%2FSOS_PET_API%2Fblob%2Fmaster%2FInsomnia.json)

> status:	🚧  Challenge-Bravo 🚀 em construção..  🚧

API, que responde JSON, para conversão monetária. Ela tem uma moeda de lastro (USD) e faz conversões entre diferentes moedas com cotações.

A API, originalmente, converte entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

## Indice

* <p><a href="#pré-requisitos">Pré Requisitos</a> </p>  
* <p><a href="#iniciando-projeto">Iniciando Projeto</a></p>
* <p><a href="#rotas">Rotas</a></p>
* <p><a href="#executando-os-testes">Executando os testes</a></p>
* <p><a href="#relatório-de-cobertura-de-testes">Relatório de cobertura de Testes</a></p>
* <p><a href="#autor">Autor</a></p>




## Pré Requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
* [Git](https://git-scm.com) 
* [Node.js](https://nodejs.org/en/)

Além disso, é bom ter um editor para trabalhar com o código como: [VSCode](https://code.visualstudio.com/)



## Iniciando Projeto

```bash
# Clone este repositório
$ git clone https://github.com/WallaceMachado/challenge-bravo.git

# Acesse a pasta do projeto no terminal / cmd 
$ cd challenge-bravo

# Instale as dependências
$ npm install

or

$ yarn

# Rode o projeto
$ yarn dev

# Server is running:3333 - acesse <http://localhost:3333>
```



## Rotas

| Rotas  |  HTTP Method  | Params  |  Desccrição  |
| :---: | :---: | :---: | :---: |
|  /currency |  POST |  Body: ``` name ```, ``` code ``` e ``` valueInUSD ``` |  Crie uma nova moeda |
|  /currency |  GET |  -  | Recupere uma lista com todas as moedas |
|  /currency/conversion |  GET |  Query: ```from ``` (moeda de origem), ``` to ``` (moeda de conversão), ``` amount ``` (valor a ser convertido)  |  Consulte uma conversão monetária |
|  /currency/edit/:id |  PUT |  Body: ``` name ```, ``` code ``` e ``` valueInUSD ```  |  Edite uma moeda |
|  /currenc/:id |  DELETE |  -  |  Exclua uma moeda |
 




## Executando os testes

[Jest](https://jestjs.io/) foi a escolha de testar o projeto, para executar:

```bash

$ yarn test

```



## Relatório de cobertura de Testes

Você pode ver o relatório de cobertura dentro ``` tests/coverage ```. Eles são criados automaticamente após a execução dos testes.



## Autor


Feito com ❤️ por [Wallace Machado](https://github.com/WallaceMachado) 🚀🏽 Entre em contato!

[<img src="https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white" />](https://www.linkedin.com/in/wallace-machado-b2054246/) 


