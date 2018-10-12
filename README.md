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
```

Existe ainda um outro tipo de teste que esse projeto aborda, o teste de estresse. Para roda-lo, é necessário que você inicie esta API no seu terminal, e em outra janela de terminal, que o seguinte código seja executado.

```
make test-stress
```

## Quais são os endpoints?

### Saúde da Api
get `/health`.

Response:
```
{
  "api": true,
  "integrations": {
    "cryptoCompare": true
  }
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

## Informações importantes
Para pegar a taxa de conversão entre as moedas, esse projeto utiliza a *CRYPTOCOMPARE*, que é uma API gratuita que fornece os valores de conversão entre as moedas. Confesso que esse desenvolvedor ficou um pouco em dúvida, porque ao comparar com a taxa de conversão do Google, os valores da API se mostraram proxímos, mas não iguais. Achei outras APIs, porém ora eram pagas, ou não funcionavam com as criptomoedas. Assumi que como esse projeto se trata mais de uma demonstração de como eu organizaria o projeto, não teria tanta importancia a utilização da mesma.

Outro ponto importante, agora assumindo o pressuposto de que se trata de aplicação com fins monetários, e que quando o assunto é dinheiro, a API tem que estar sempre em pé, as taxas de conversão são salvas em memória, a cada request. Se em algum momento, algum request falhar, a idéia é utilizar a taxa de conversão da mesma moeda salva em memória, onde existe uma grande chance de estarmos retornando um valor atual para o usuário.

Um improvement interessante seria utilizar a memória mais vezes, em vez de a cada request o projeto consultar em outra API a taxa de conversão.

Outro improvement seria formatar os valores retornados no formato de dinheiro, por exemplo: `23.87653` -> `23.88`. Mas isso já depende do front que estará consumindo a API.


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
