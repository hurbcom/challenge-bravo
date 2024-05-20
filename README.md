# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

[[English](README.md) | [Portuguese](README.pt.md)]

## Install

The first step is to config this application is create a `.env` file using the `.env.example` present here as a guide. This application uses [_CoinAPI_](https://www.coinapi.io/) and also [_CoinMarketCap API_](https://coinmarketcap.com/api/) to work, so you will need to request their API keys or have them available already.

To run this API you will need to have Docker already installed in your machine. Assuming you already have it, you just need to run the following command:

`docker-compose up`

**Warning**: There is a simple redis structure on this project to facilitate testing, but in a real scenario it is recommended to replace this structure or modify to improve security/ performance (Redis can be slower inside a docker container). You can change the url using the variable REDIS on the enviroment file.

This application provides a API that converts a given currency and amount to another coin. It has the following currencies as default:
-   USD
-   BRL
-   EUR
-   BTC
-   ETH

If you wish you can change the default list as well using the `.env` file. The default currencies listed on `.env` can't be removed via API. 


## Conversion

### Request

`GET /conversion`

    curl --location 'localhost:3100/conversion?from=BTC&to=BRL&decimalPlaces=30'

### Query Parameters    
    | Parameter       | Description                          | Required | Type   |
    | --------------- | ------------------------------------ | -------- | ------ |
    | `from`          | Initial currency                     | Yes      | string |
    | `to`            | Desired currency rate                | Yes      | string |
    | `amount`        | Desired amount to convert            | No       | number |
    | `decimalPlaces` | Desired decimal places. Default is 8 | No       | number |

### Response

    Status: 200
    Content-Type: application/json

    {
        "from": "BTC",
        "amount": 1,
        "to": "BRL",
        "value": "345964.377343084448906460570000000000"
    }

## Authentication 

The token returned by this endpoint is required to add and remove coins from the system. This project version has only one admin user configurable in the `.env`. The token has expiration time of 2 hours.

### Request

`POST /login`

    curl --location 'localhost:3100/login' \
    --header 'Content-Type: application/json' \
    --data '{
        "login":"admin",
        "password":"admin"
    }'

### Body  
    | Field      | Description           | Required | Type   |
    | ---------- | --------------------- | -------- | ------ |
    | `login`    | Defined on enviroment | Yes      | string |
    | `password` | Defined on enviroment | Yes      | string |

### Response

    Status: 200
    Content-Type: application/json

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIw....."
    }

## Refresh Token

### Request

`GET /refesh`

    curl --location 'localhost:3100/refresh' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIwMjYxNDUyNSwiaWF0IjoxNzE2MjAyNjE0LCJleHAiOjE3MTYyMDk4MTR9.yxO-a_LBhcwUVrO4TekbT0beER5YywYBSI5kWaBy_GQ'

### Headers
    | Field           | Description | Required | Type   |
    | --------------- | ----------- | -------- | ------ |
    | `Authorization` | Token       | Yes      | string |

### Response

    Status: 200
    Content-Type: application/json

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIw....."
    }

## Add Currency

This endpoint add new currencies in this platform. Needs authentication

### Request

`POST /add`

    curl --location 'localhost:3100/add' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjE4NzE0MzA2MSwiaWF0IjoxNzE2MTg3MTQzLCJleHAiOjE3MTYxOTQzNDN9.kc862x0RNknfeGI3baiDfKatsSupwLO-MMzD-EJx50I' \
    --header 'Content-Type: application/json' \
    --data '{
        "symbol":"GTA",
        "type":"crypto"
    }'

### Body
    | Field                 | Description                                                            | Required | Type   |
    | --------------------- | ---------------------------------------------------------------------- | -------- | ------ |
    | `symbol`              | Currency symbol                                                        | Yes      | string |
    | `type`                | Currency type                                                          | Yes      | Enum   |
    | `rate`                | Rate default. Only to fixed type                                       | No       | number |
    | `scrpprRateAsset`     | The rate asset of the value searched with the scrapper. Default is USD | No       | string |
    | `scrpprUrl`           | Web Page url. Required for the scrapper                                | No       | string |
    | `scrpprAmountTag`     | Tag for looking for amount. Without the amount will be 1               | No       | string |
    | `scrpprRateTag`       | Tag for looking for the rate. Required for the scrapper                | No       | string |
    | `scrpprDecimalSymbol` | Decimal symbol. Default is a comma(,)                                  | No       | string |

### CurrencyTypes Enum
| Enum       | Description                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------- |
| `fiat`     | Fiat currency                                                                                      |
| `Crypto`   | Crypto currency                                                                                    |
| `Fixed`    | Rate fixed                                                                                         |
| `Scrapper` | Load currency data from a web page. Only use if you can't get the data using fiat and crypto types |

**Warning**: The fixed and scrapper types will be overrited if the currency is found within CoinAPI.io and/or MarketCap API. They are mean to be used when you can't find the coin by normal means. Ex: Ficticious coin as D&D Coin.


### Scrapper Example
    curl --location 'localhost:3100/add' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjIwNDA3Mzg4MiwiaWF0IjoxNzE2MjA0MDczLCJleHAiOjE3MTYyMTEyNzN9._jjuooOorYKFB4IsQ10MqDWyZTgWmJ29F5llaEA0BW0' \
    --header 'Content-Type: application/json' \
    --data '{
        "symbol":"GTAOnline",
        "type":"scrapper",
        "scrpprRateAsset":"BRL",
        "scrpprUrl":"https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D",
        "scrpprAmountTag":".psw-c-t-2",
        "scrpprRateTag":".psw-t-title-m"
    }'

### Response

    Status: 200
    Content-Type: application/json

    {
        "message": "Asset GTA6 added with success!"
    }


## Remove Currency

This endpoint removes currencies from this application. Needs authentication. Default coins can't be removed.

### Request

`DELETE /remove/:asset`

    curl --location --request DELETE 'localhost:3100/remove/IOTA' \
    --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRldGltZSI6MTcxNjE4NzE0MzA2MSwiaWF0IjoxNzE2MTg3MTQzLCJleHAiOjE3MTYxOTQzNDN9.kc862x0RNknfeGI3baiDfKatsSupwLO-MMzD-EJx50I'


### Response

    Status: 200
    Content-Type: application/json

    {
        "message": "Asset GTA6 removed with success!"
    }


Done! ;)

<p align="center">
  <img src="completed.jpg" alt="Challange completed" />
</p>
