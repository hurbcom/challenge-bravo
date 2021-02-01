# Currency Converter

> API de conversão de moedas.

API para converter valores de moedas usando diferentes taxas cambiais.
As taxas cambiais são atualizadas de forma automática a cada 30 minutos.

## Projeto

O projeto foi criado com as seguintes tecnologias:

* Docker
* docker-compose
* Node
* MongoDB
* Redis

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

Buscando uma moeda:

`GET 0.0.0.0:5000/currencies/PHP`

```
  {
    "_id": "600905bd9640e7037b38209c",
    "label": "Phillipines Test",
    "__v": 0
  }
```

Removendo uma moeda:

`DELETE 0.0.0.0:5000/currencies/PHP`

Convertendo valores entre diferentes taxas cambiais:

`GET 0.0.0.0:5000/exchanges/convert?from=USD&to=BRL&amount=123.45`

```
  {
    "amount": "667.8645"
  }
```

## Rodando os testes

`docker-compose run --rm hurb yarn test`

## Bonus

No repositório existe um submodulo (frontend) do git, que é um projeto React. Nele exemplifico o uso da API em um projeto web.
O projeto possuí como dependência a API, ao rodá-lo,  é necessário que a API esteja configurada.

Inicialize o submodulo:

`git submodule init`

Força o git a clonar o submodulo:
`git submodule update`

Incializa o frontend e suas dependências:
`docker-compose up app`