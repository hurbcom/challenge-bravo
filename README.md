# HURB Challenge

**HURB** Challenge feito em **Node.js e REACT**.

## pacotes globais
 - [Docker-cli - (conteinerização)](https://docs.docker.com/)
 - [Node.js - (js engine)](https://nodejs.org/en/)
## Pacotes usados no backend
 - [Express.js - Framework leve](https://expressjs.com/)
 - [Axios.js - Requisições](https://yarnpkg.com/package/axios)
 - [Postgres - Banco](https://yarnpkg.com/package/pg)
 - [Dotenv - Carregar variaveis de ambiente](https://yarnpkg.com/package/dotenv)
 - [Joi - Validação](https://yarnpkg.com/package/joi)
 - [Sequelize - ORM](https://yarnpkg.com/package/sequelize)
 - [Swagger - Documetação de rotas](https://yarnpkg.com/package/swagger-ui-express)
 - [Fns - Formatador de datas simples e bem completo](https://yarnpkg.com/package/date-fns)
 - [Jest - Testes unitários ](https://yarnpkg.com/package/jest)
 - [Supertest - Testes de integração](https://yarnpkg.com/package/supertest)
 - [sqlite3 - Banco para testes](https://yarnpkg.com/package/sqlite3)

## Bibliotecas / frameworks usadas no frontend

 - [Bootstrap - framework](https://yarnpkg.com/package/bootstrap)
 - [Node Sass - pré procesador para scss](https://yarnpkg.com/package/node-sass)
 - [React - Biblioteca js ](https://yarnpkg.com/package/node-sass)
 - [SweetAlert - Mensagens para o usuario customisadas ](https://yarnpkg.com/package/react-bootstrap-sweetalert)
 - [Text-Mask - Máscara para campos ](https://yarnpkg.com/package/text-mask-addons)


## Instalação

Ter Docker-cli e Nodejs instalado na máquina

1. Renomear o arquivo .env.exemplo para apenas .env ;
2. > docker-compose up

## Ferramenta usada em desenvolvimento para fazer a requisições ao BackEnd

Foi usado para desenvolvimento a ferramenta **Postman**

## Testes

1. Trocar no .env o valor da variavel NODE_ENV para test
2. rodar o comando:
    > yarn test

cobertura de testes aplicada.
<p align="center">
  <img src="coverage.png" alt="Challange accepted" />
</p>