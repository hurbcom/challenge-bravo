# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

A Rest API for Currency Conversion.

## Contents
 - [Technologies](#technologies)
 - [Description](#description)
 - [Requirements](#requirements)
 - [Installation](#installation)
 - [Usage](#usage)
 - [Testing](#testing)
   - [Unit tests](#unit-tests)
   - [Integration tests](#integration-tests)
   - [Stress tests](#stress-tests)
 - [API Documentation](#api-documentation)

## Description

This API lets you make conversions between different currencies.

The initial currencies that are already registered are USD, BRL, EUR, BTC and ETH.

You are also able to register any currency (FIAT, crypto or fictitious - exchange rate for fictitious currency must be provided). You can also list all registered currencies and delete any.

:warning: This app retrieves currencies rates every hour from [Free Currency Rates API](https://github.com/fawazahmed0/currency-api).

## Technologies

This project is currently using:

 - NodeJS 16.14.2
 - npm 8.6.0
 - Express 4.18.8
 - Docker 20.10.14
 - MongoDB 5.0.8
 - Mongoose 6.3.1
 - Jest 28.0.1
 - SuperTest 6.2.3
 - Artillery 2.0.0
 - ESLint 8.2.0

## Requirements

 - Docker 20

## Installation

To install the project, run

    docker-compose build

:gear: This project uses a local MongoDB running in Docker. It is using a `mongoimport` to seed the Database with initial values from [currencies.json](/mongo_seed/currencies.json) (USD, BRL, EUR, BTC and ETH).

## Usage

To run the project, run

    docker-compose up

:heavy_check_mark: Done, now you'll be able to use the API using the Swagger UI at [http://localhost:3000](http://localhost:3000/).

## Testing

To run the automated tests (unit, integration and stress), run

    npm test

:robot: This project also uses Github Actions to test it everytime a commit is pushed. The report html file for the stress test can be found in the actions artifacts.

Here is a snapshot of the results:

 ### Unit tests

Jest was used for unit testing. All services and controllers were fully tested.

![Unit tests](./imgs/unit-tests.PNG?raw=true "Unit tests")

 ### Integration tests

Supertest was used for integration testing. All routes fully tested (use cases).

![Integration tests](./imgs/integration-tests.PNG?raw=true "Integration tests")

 ### Stress tests

 Artillery was used for stress testing. With 5000 requests per second, 4490 requests were successfully completed.

![Stress tests](./imgs/stress-tests.PNG?raw=true "Stress tests")

## API Documentation

:rocket: Please refer to [API Documentation](./ApiDocumentation.md).

To update the auto-generated API documentation (that is used by Swagger), run

    npm run docs
