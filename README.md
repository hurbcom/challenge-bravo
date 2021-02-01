# Challenge-Bravo
A currency API that allows users to convert money, challenge from HURB

## Stack

- NodeJS
- Express
- MongoDB
- Mocha for testing
- Docker, Docker-compose
- [coingecko-api](https://www.npmjs.com/package/coingecko-api) to get the currencies
- Swagger

## Requirements
- Docker and docker-compose

## How to run the app locally on Docker

```docker-compose up --build --force-recreate```

## Stress Test

Make sure that the app is running on docker or just run the command

```docker-compose up -d --build --force-recreate```

To run it detached and after that run:

- `yarn` or `npm install` to install the dependencies.
- `yarn artillery-test` or `npm run artillery-test` to run the stress test.


## Testing

`yarn test`

## Swagger Docs Environment

You can run tests from it

- Swagger docs: http://localhost:3000/api-docs

## Local Environment

- Docker: http://localhost:3000

## API examples and docs

**`GET -> /api/currency`**

Get a list from the current currencies

**Response json:**
```json
[
  {
    "_id": "6014a6a961e9a8df76a4c09d",
    "key": "usd",
    "name": "US Dollar",
    "unit": "$",
    "type": "fiat"
  },
  {
    "_id": "6014a6a961e9a84ac4a4c09f",
    "key": "brl",
    "name": "Brazil Real",
    "unit": "R$",
    "type": "fiat"
  },
  {
    "_id": "6014a6a961e9a816d7a4c0a1",
    "key": "eur",
    "name": "Euro",
    "unit": "€",
    "type": "fiat"
  },
  {
    "_id": "6014a6a961e9a8051da4c0a3",
    "key": "eth",
    "name": "Ether",
    "unit": "ETH",
    "type": "crypto"
  },
  {
    "_id": "6014a6a961e9a8a8eba4c0a5",
    "key": "btc",
    "name": "Bitcoin",
    "unit": "BTC",
    "type": "crypto"
  }
]
```

**`GET -> /api/currency/convert/latest`**

Get the latest updated currencies saved on MongoDB

**Response json:**
```json
{
  "_id": "6014a7d4274e94a55f33d113",
  "referenceDate": "2021-01-30T00:27:00.114Z",
  "usd": 1,
  "brl": 5.462234128281574,
  "eur": 0.8238790070674381,
  "eth": 0.0007176712274362895,
  "btc": 0.000028862707719134912
}
```


**`GET -> /api/currency/convert?from={from_currency}&to={to_currency}&amount={value}`**

Convert a currency to another one given the parameters, change the {from_currency} to for example **brl** {to_currency} for example to **usd** and {value} to **100** for example.

**Response json:**
```json
{
  "from": "brl",
  "to": "usd",
  "amount": 100,
  "value": 18.307527208686135,
  "referenceDate": "2021-01-30T00:31:04.122Z"
}
```


**`POST -> /api/currency/`**

Creates a new currency given the currency code.

**Body with a JSON:**
```json
{
    "key": "GBP"
}
```

**Return:**
```json
{
  "key": "gbp",
  "name": "British Pound Sterling",
  "unit": "£",
  "type": "fiat",
  "_id": "6014a9c3274e94282d33d11d"
}
```

**`DELETE -> /api/currency/{currency_code}`**

Deletes a currency from the API, to test just change the {currency_code} to a saved currency such as **brl** for example.

**Return:** 

* HTTP status code 204
