# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo - Backend API

## Overview
This API was built to provide a currency convertion, which you can convert an amount of money to whatever the unit chosen,since it is valid an available in our API.

## Running the application
To run the application you just need to run the following command: `docker-compose up --build`.\
Double check if ports `3333`, `27017`, `9090` are available, our application will need them.

> You also can run the application by just running `docker build -t carlos/bravo .` and `docker run -p 3333:3333 carlos/bravo`. But in this case, youhave to ensure that you set up all the necessaries services by yourself.


| Port | Usage | 
| ------------- |:-------------:|
| 3333 | Application express serverr |
| 9090 | Prometheus |
| 27017 | MongoDB |

## Running the tests
To run the tests you just need to run the following command: `npm run test`.

## Why Prometheus?
Prometheus is an awesome tool used for collecting metrics of our application, like CPU usage, Memory Usage, number of threads and a bunch of others advantages.\
Prometheus can use itself as a datasource of these metrics so we can use then in other monitoring systems like Grafana, per exemple.

## Why JWT?
One of the requirements of the application is to avoid security troubles, to avoid that, I used authentication by passing a token (JWT), if JWT we can hold user's data and hash them in a secret hash held by us in our application.
Holding this secret hash, we will be the only who will be able to "revert" the token and get user's data.\
Another advantage of using JWT is that we don't need to store user's session.

## Why MongoDB
MongoDB was needed to hold users registries, mongoDb is usually very fast for reading and very easy to code if Mongoose package.


## Usage

### First of all, you need to register a valid user:

`POST - /api/v1/users/register`\
`Payload - {
    "name" : "Carlos",
    "email" : "email@email.com",
    "password" : "102030"
}`

`Response data example:
{
    "data": {
        "_id": "2222222222",
        "name": "Carlos",
        "email": "emaifffl@email.com",
        "createdAt": "2021-01-31T19:48:33.560Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTcwOTkxNTdhYmY5MDAxMjEyMjUzZiIsImlhdCI6MTYxMjEyMjUxMywiZXhwIjoxNjEyMjA4OTEzfQ.fqEN790ThFzpe953Nihb6zydVS8GGVhWyYn7zgJBmJo"
}`

Save this token somewhere, you will need it.

### If you already have an user, just authenticate

`POST - /api/v1/users/login`\
`Payload - {
    "email" : "email@email.com",
    "password" : "102030"
}`

`Response data example:
{
    "data": {
        "_id": "2222222222",
        "name": "Carlos",
        "email": "emaifffl@email.com",
        "createdAt": "2021-01-31T19:48:33.560Z",
        "__v": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwMTcwOTkxNTdhYmY5MDAxMjEyMjUzZiIsImlhdCI6MTYxMjEyMjUxMywiZXhwIjoxNjEyMjA4OTEzfQ.fqEN790ThFzpe953Nihb6zydVS8GGVhWyYn7zgJBmJo"
}`

Save this token somewhere, you will need it.

**Health endpoint**\
`GET - /api/v1/health`\
`Authentication : Bearer Token` -> You must provide the `token` you got in registration/authentication.

This route is only used to check if our API is working properly..

**Available currencies endpoint**\
`GET - /api/v1/available-currencies`\
`Authentication : Bearer Token` -> You must provide the `token` you got in registration/authentication.

This route is used to show the currencies that our API accepts.\
The innitial available currencies are: 
- USD
- BRL
- EUR
- BTC
- ETH

**Add available currencies endpoint**\
 `POST - /api/v1/add-available-currencies`\
`Authentication : Bearer Token` -> You must provide the `token` you got in registration/authentication.
 
This route is used to add a new valid currency to our API. 
> A currency must be a string up to 4 characters.

**Convert amount endpoint**\
`GET - /api/v1/convert?from=USD&to=BRL&amount=136.52`\
`Authentication : Bearer Token` -> You must provide the `token` you got in registration/authentication.

This endpoint is used to convert an amount "from" to a "to" value.
> Per example, if you want to convert 1500 dolas to reais then you will convert USD to BRL.

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
