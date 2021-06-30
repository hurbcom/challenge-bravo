# Currencies' Conversion API (challenge-bravo)

A REST API for currencies' conversion using Node.js

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Install [Node](https://nodejs.org/en/)
- (Linux ONLY) Install [Docker Engine](https://docs.docker.com/engine/install/#server) and [Docker Compose](https://docs.docker.com/compose/install/#install-compose)
- (MacOS or Windows ONLY) Install [Docker Desktop](https://docs.docker.com/desktop/)

### Install and Run

To have a copy of this project up and running, follow the instructions below

- First, download the repository or clone it with the provided URL

- Navigate to the project's folder

```cd ~/[PROJECTS-FOLDER]/```

- With your Docker already configured and running, start the project with the command

```docker-compose up -d```

## How To Use

Once you start the project, the api base url will be `http://localhost:3001`

### List all supported currencies

```
// request
GET:{{base_url}}/currency

// response
{
    "message": "Success",
    "data": {
        "list": [
            "USD",
            "BRL",
            "EUR",
            "BTC",
            "ETH"
        ]
    }
}
```

### Convert an amount from a currency to another

```
// request
GET:{{base_url}}/currency/convert?from=BRL&to=USD&amount=12.99

// response
{
    "message": "Success",
    "data": {
        "amount": 2.59,
        "currencyCode": "USD"
    }
}
```

### Add a new ficticious currency

```
// request
POST:{{base_url}}/currency
body: {
    "currencyCode": "HURB",
    "currencyQuote": 0.27
}

// response
{
    "message": "Successfully created",
    "data": {
        "currencyCode": "HURB",
        "currencyQuote": 0.27
    }
}
```

### Add a new real currency

```
// request
POST:{{base_url}}/currency
body: {
    "currencyCode": "EUR"
}

// response
{
    "message": "Successfully created",
    "data": {
        "currencyCode": "EUR"
    }
}
```

### Delete a currency

```
// request
DELETE:{{base_url}}/currency/BRL

// response
{
    "message": "Success",
    "data": {
        "currencyCode": "BRL"
    }
}
```

## Built With

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [Jest](https://jestjs.io/) - JavaScript Testing Framework
- [Yup](https://github.com/jquense/yup) - A JavaScript schema builder for value parsing and validation
- [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database

## Authors

- **Daniela Rocha** - _Initial work_ - [Daniela Rocha](https://github.com/danirocha)

## Acknowledgments

- Commits messages' convention from [here](https://github.com/pvdlg/conventional-commit-types)
- Complete postman collection with response examples [here](https://github.com/danirocha/challenge-bravo/blob/main/docs/challenge_bravo_2021-06-30.postman_collection)

### Commands that can help you cope with some problems:
- `docker-compose down` - Stops all docker services that are running
- `docker-compose logs` - Shows the logs of all running services
- `docker ps -a` - Show status of all your Docker containers, even the stoped ones