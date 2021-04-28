<h1 align="center"> Challenge Bravo</h1>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Hub Hurb</p>

## Description

API para conversão monetária, com retorno em JSON. API possui uma moeda de lastro (USD) e calcula conversões entre diferentes moedas com cotações de verdade e atuais.

Originalmente, as seguintes moedas são convertidas pela API:

* USD
* BRL
* EUR
* BTC
* ETH

Documentação da API no formato **Swagger UI** está acessível em `https://localhost:3000/api`

## Rotas

```http
GET /exchange?from=BTC&to=EUR&amount=123.45
POST /todo/
DELETE /todo/
```

## Dependências externas:

APIS de conversão monetária de terceiro utilizadas : TODO

## Installation

```bash
$ git clone $este-fork
cd $seu-fork
yarn ( ou npm)
yarn start
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
