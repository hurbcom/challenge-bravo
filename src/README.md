<h1 align=center>
  Currency API
  <img align=center src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="20%" /> 

</h1>

Aplicação Node.js criada para o desafio challenge-bravo da hurb.

* [Overview](./docs/CHALLENGE.md)
* [Sobre a arquitetura](./docs/ARCHITECTURE.md)
* [Sobre as tecnologias](./docs/TECHS.md)

## Pre-requisitos para execução

* Docker
* Docker Compose

## Executando

* (Caso esteja no diretório inicial) Acesse a pasta src da aplicação
* Renomeie/copie o arquivo `.env.sample` para `.env` .
* Execute o seguinte comando

``` bash
docker-compose up -d --build
```

Isto criará dois containers Docker orquestrados pelo docker-compose. Um para o Redis e outro para a aplicação.

Agora visite http://localhost:4000. Caso tudo tenha ocorrido certo, você irá visualizar uma mensagem da API dizendo que tudo está ok. E então, poderá fazer as requisições que necessitar.

## Endpoints

O projeto disponibiliza um endpoint com o SwaggerUI, acessível em `/api/{APP_VERSION}/swagger.json` . Este endpoint apresenta todos os endpoints disponíveis da aplicação.

## Testes

Os testes podem ser executados pelo seguinte comando:

``` 
npm test
```

## Contato

Para eventuais necessidades de informação, por favor entrar em contato.

Site: [https://ronkiro.github.io](https://ronkiro.github.io)

E-mail: [dev_alex@outlook.com](mailto:dev_alex@outlook.com)
