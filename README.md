# Desafio Bravo [![Build Status](https://travis-ci.org/felippemauricio/challenge-bravo.svg?branch=master)](https://travis-ci.org/felippemauricio/challenge-bravo) [![JavaScript Style Guide: Good Parts](https://img.shields.io/badge/code%20style-goodparts-brightgreen.svg?style=flat)](https://github.com/felippemauricio/challenge-bravo "JavaScript The Good Parts") [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/felippemauricio/challenge-bravo)

Esse projeto consiste em uma API que faz a converção monetária entre algumas moedas.

Até o momento, esse projeto aceita apenas as seguintes moedas:
- BRL
- BTC
- ETH
- EUR
- USD

![](https://e.rpp-noticias.io/normal/2017/08/02/021602_457141.jpg)

## O que você precisa instalar para trabalhar neste projeto?

- docker
- git
- make

## Como instalar as dependências?
```
make install
```

## Como rodar o projeto em ambiente de desenvolvimento?

```
make start
```

## Como rodar o lint?
```
make lint
```

## Como rodar os testes?

Esse código, rodará todos os testes unitários e os de sistema.

```
make test
```

Você pode também, rodar cada tipo de teste separadamente.

```
make test-unit // Para testes unitários
make test-system // Para testes de sistema
make test-stress // Para testes de estresse
```

## Quais são os endpoints?

### Saúde da Api
get `/health`.

Response:
```
{
  "api": true
}
```

### Conversor de moedas
get `/currency-conversion?from=BTC&to=EUR&amount=123.45`.

get `/currency-conversion?from=BTC&to=EUR,BRL&amount=123.45`.

Response:
```
{
  "amount": 123.45,
  "base": "BTC",
  "date": "2018-10-07",
  "rates": {
    "EUR": 5711.39
  },
  "converted": {
    "EUR": 705071.0955
  }
}
```

## Variaveis de Ambiente
Em todos os ambientes, você pode configurar as seguintes váriaveis de ambiente:

| VARIÁVEL                     | DEFAULT                | DESCRIÇÃO                                               |
|------------------------------|:----------------------:|---------------------------------------------------------|
| CRYPTOCOMPARE_URL            |                        | Url para acessar a CryptoCompare API                    |
| CRYPTOCOMPARE_RETRY_DELAY    | 100                    | Delay entre uma requisição e sua retentativa            |
| CRYPTOCOMPARE_RETRY_TIMES    | 1                      | Retentativas em caso de falha                           |
| CRYPTOCOMPARE_TIMEOUT        | 3000                   | Timeout da requisição                                   |
| NODE_ENV                     | development            | Ambiente                                                |
| PORT                         | 3000                   | Porta em que a API irá ser executada                    |
