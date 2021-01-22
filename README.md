# Currency Converter

> Api de conversão de moedas.

O desafio consiste em converter um montante de valor em moedas com diferentes taxas cambiais.

## Projeto

O projeto foi criado com as seguintes tecnologias:

* Docker
* docker-compose
* Node
* MongoDB
* Redis

### Backend

API Node rodan.

### Frontend

????.

## Instalação

**Usando Docker & docker-compose**

Execute o script de criação das moedas suportadas:
`docker-compose run --rm hurb yarn seed`

Execute o script de criação de carregamento inicial das taxas de câmbio:
`docker-compose run --rm hurb yarn load:rates`

Inciando o projeto:
`docker-compose up hurb`

![](https://memegenerator.net/img/instances/82338138.jpg)

## Exemplos de uso da API
Inserindo uma nova moeda:

`POST 0.0.0.0:5000/currencies`

```
BODY
  {
    "symbol": "PHP",
    "label": "Philippine Peso"
  }
```

Convertendo valores entre diferentes taxas cambiais:

`GET 0.0.0.0:5000/exchanges/convert?from=USD&to=BRL&amount=123.45`

## Rodando os testes

`docker-compose run --rm hurb yarn test`