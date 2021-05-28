# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

A API deve suportar conversão entre moedas verídicas e fictícias. Exemplo: BRL->HURB, HURB->ETH

<br />

# Requisitos

- [x] Deve ser possível adicionar moedas reais ou fictícias que serão suportadas pela API.
- [x] Deve ser possível remover moedas reais ou fictícias.
- [x] Deve ser possível listar todas as moedas cadastradas.
- [x] Deve ser possível realizar conversões monetárias entre as moedas cadastradas.

<br />

# Observações

- A API externa que utilizei, no plano gratuito, atualiza as cotações das moedas diariamente e possui uma limitação de requisições diária. Com isso, ao adicionar uma moeda, a aplicação inclui uma data de expiração no dia seguinte e, ao tentar realizar uma conversão, a aplicação verifica se o valor monetário em dólar das moedas já estão expirados; se estiver, ela faz outra busca na API externa para atualizar o valor. Assim, o número de requisições externas ficam bem controlados.
- Como a API externa precisa de uma API_KEY, resolvi deixa-la no arquivo ".env", mas num caso real, ela não seria exposta no repositório.

<br />

# Rotas

## Conversão

```http
GET http://localhost:3333/currencies/convert?from={CURRENCY_CODE}&to={CURRENCY_CODE}&amount={AMOUNT}

Examplo:
http://localhost:3333/currencies/convert?from=BRL&to=USD&amount=100

Reposta:
{
  "descripition": "100 Brazilian Real em US Dollar",
  "value": 19.09
}
```

<br />

## Listar todas

```http
GET http://localhost:3333/currencies/

Reposta:
[
  {
    "id": "3c9b0757-a5a2-457d-ad79-426e51b0403e",
    "expireAt": "2021-05-27T03:00:00.000Z",
    "currencyCode": "EUR",
    "currencyName": "Euro",
    "priceUsd": "0",
    "isFictional": false
  },
  {
    "id": "5d972597-a688-4191-af4e-9a8fc5e7aaa2",
    "expireAt": null,
    "currencyCode": "USD",
    "currencyName": "US Dollar",
    "priceUsd": "1",
    "isFictional": false
  },
  {
    "id": "fd2a123f-6ce7-4be3-859e-f3beda5a86d8",
    "expireAt": "2021-05-28T00:00:00.000Z",
    "currencyCode": "ETH",
    "currencyName": "Ethereum",
    "priceUsd": "2776.929315201368",
    "isFictional": false
  },
  {
    "id": "b61cc7fb-301e-4af2-8403-66fc5d50ebbe",
    "expireAt": "2021-05-28T00:00:00.000Z",
    "currencyCode": "BTC",
    "currencyName": "Bitcoin",
    "priceUsd": "38824.427814328046",
    "isFictional": false
  },
  {
    "id": "851e20f3-789b-4ea3-9c1f-f69f5e0266fb",
    "expireAt": "2021-05-29T00:00:00.000Z",
    "currencyCode": "BRL",
    "currencyName": "Brazilian Real",
    "priceUsd": "0.19089802603858877",
    "isFictional": false
  }
]
```

<br />

## Cadastrar moeda

```http
POST http://localhost:3333/currencies/

Body:
{
	"currencyCode": "GBP"
}

Reposta:
{
  "id": "8fe8ed1b-d0a8-407b-a1c2-b37464ae0c04",
  "expireAt": "2021-05-29T00:00:00.000Z",
  "currencyCode": "GBP",
  "currencyName": "Pound Sterling",
  "priceUsd": 1.417654056049924,
  "isFictional": false
}
```

<br />

## Cadastrar moeda fictícia

```http
POST http://localhost:3333/currencies/fictional

Body:
{
	"currencyCode": "HURB",
	"currencyName": "Hotel urbano",
	"priceUsd": 347.95
}

Reposta:
{
  "id": "f8ea0a6c-f250-492f-bf11-c148b516d15f",
  "expireAt": null,
  "currencyCode": "HURB",
  "currencyName": "Hotel urbano",
  "priceUsd": 347.95,
  "isFictional": true
}
```

<br />

## Remover moeda

```http
DELETE http://localhost:3333/currencies/:currencyCode

Exemplo:
http://localhost:3333/currencies/BRL


Reposta:
204 - No Content
```

<br />


# Rodando a aplicação

```bash
#clonando repositório
$ git clone $fork

#entrando na pasta do projeto
$ cd $pasta_do_projeto

#rodando a aplicação
$ docker-compose up -d
```
<br />

## ATENÇÃO
Caso seja a primeira vez que rodou o projeto e o banco de dados não esteja populado, rode o seguinte comando:

Com yarn:
```bash
$ yarn seed:default_currencies
```

Com npm:
```bash
$ npm run seed:default_currencies
```

<br />

# Teste

Com yarn:
```bash
$ yarn test
```

Com npm:
```bash
$ npm run test
```