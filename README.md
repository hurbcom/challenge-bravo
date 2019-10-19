# Eson Challenge-Bravo

This project uses Node, Typescript and Docker.

## To avoid errors with node version, we recommend to use Node v10.16.0

# Preparing Development Environment
## With Npm
1. Clone the project with "git clone https://github.com/edysison/challenge-bravo.git"

2. Run "npm install"

3. Run the command "npm run dev" to generate a local enviroment

## Building with Docker
1. Run the command "docker-compose up -d"

2. Access at http://localhost:3000

# Routes & Params
## Get all
1. This service is based on https://docs.awesomeapi.com.br/api-de-moedas that only supports a few tipes of currencies, so use this endpoint to check which currencies we currently support

2. Get all currencies that the service can support

3. Route GET localhost:3000/currencies

4. Response: JSON Result  Ex: { "list":"USD,USDT,CAD,EUR,GBP,ARS,BTC,LTC,JPY,CHF,AUD,CNY,ILS,ETH,XRP,BRL" } 

## Add Currency 
1. Initially the service will only accept "USD", "BRL", "EUR", "BTC", and "ETH", so use this API to increase the types of coins that the server will allow to conversion

2. Route POST localhost:3000/currencies

3. Param Body: { "currency": CODE } Ex: { "currency":"GBP" }

3. Response: JSON Result  Ex: { "currencies": "BRL,EUR,BTC,ETH,USD,GBP"}


## Remove Currency 
1. Initially the service will only accept "USD", "BRL", "EUR", "BTC", and "ETH", so use this API to decrease the types of coins that the server will allow to conversion

2. Route DELETE localhost:3000/currencies

3. Param Body: { "currency": CODE } Ex: { "currency":"USD" }

4. Response: JSON Result  Ex: { "currencies": "BRL,EUR,BTC,ETH" }


## Convert Values
1. Convert the currenct currency value to another currency

2. Route GET localhost:3000?from= YOUR_CURRENCY &to= DESIRED_CURRENCY &amount=VALUE   Ex: localhost:3000?from=BTC&to=EUR&amount=100 

3. Response: JSON Result  Ex: { "convertedValue": 723004.28 } 

## Obs:
This api uses BRL as main currency, because I wasn't abble to find an good free Api service that could generate the exchange rates for "USD", "BRL", "EUR", "BTC", and "ETH" with USD as main currency.