# Desafio - Bravo

## Depêndencias para o projeto

-   [NodeJs](https://nodejs.org/en/)
-   [Npm](https://www.npmjs.com/)
-   [Docker](https://docs.docker.com/install/overview/)
-   [Docker-Compose](https://docs.docker.com/compose/install/)

## Inicialização do Projeto

```bash
$ docker-compose up --build
```

## Execução de teste

```bash
$ npm run test
```

## Endpoints

|           Url           | Method  |    Action          |
| :---------------------: | :----:  | :-----------:      |
| /currency               |  GET    | List Currencies    |
| /currency/:symbol       |  GET    | Get Currency       |
| /currency               |  POST   | Create Currency    |
| /currency/:symbol       |  DELETE | Remove Currency    |
| /convert                |  GET    | Convert Currencies |

# List Currencies - GET - localhost:3000/currency

## Response - status 200
```json
{
  "data": [
    {
      "_id": "6058e9c4615bea01e5223578",
      "name": "Dolar",
      "symbol": "USD",
      "createdAt": "2021-03-22T19:02:28.574Z",
      "__v": 0
    },
    {
      "_id": "6058e9cb615bea01e5223579",
      "name": "Real",
      "symbol": "BRL",
      "createdAt": "2021-03-22T19:02:35.705Z",
      "__v": 0
    },
    {
      "_id": "605905581420a3037339a3b9",
      "name": "Etherium",
      "symbol": "ETH",
      "createdAt": "2021-03-22T21:00:08.879Z",
      "__v": 0
    }
  ]
}
```

# List Currency - GET - localhost:3000/currency/USD


## Response - status 200
```json
{
  "data": {
      "_id": "6058e9c4615bea01e5223578",
      "name": "Dolar",
      "symbol": "USD",
      "createdAt": "2021-03-22T19:02:28.574Z",
      "__v": 0
    },
}
```

# Create Currency - POST - localhost:3000/currency

## Request Body

```json
{
    "name": "Etherium",
    "symbol": "ETH",
}
```

## Response - status 200

```json
{
  "data": {
    "_id": "605905581420a3037339a3b9",
    "name": "Etherium",
    "symbol": "ETH",
    "createdAt": "2021-03-21T21:00:08.879Z",
    "__v": 0
  }
}
```
# Delete Currency - DELETE - localhost:3000/currency/USD

## Response - status 200
```json
{
  "data": {
      "n": 1,
      "ok": 1,
      "deletedCount": 1
  }
}
```

# Convert Currencies - GET - localhost:3000/convert?from=ETH&to=USD&amount=10

## Response - status 200
```json
{
  "data": {
    "amount": 2179.4261848556384
  }
}

```

# TO DO
## Seeds

Para que o projeto funcione corretamente, é necessário fazer as inserções iniciais das moedas.