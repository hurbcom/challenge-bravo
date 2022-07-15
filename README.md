# Challenge Bravo

Challenge Bravo is a code challenge by HURB. The goal is to create a REST API capable of converting currencies. The API must use real values for the convertions. But, it must also handle fictitious currencies.

## What you need to run this API
- Go 1.18+
- PostgreSQL (or docker + docker compose)
- An [abstract API key](https://www.abstractapi.com/api/exchange-rate-api)

## Additional info
This system tries to use strings and ints for the currencies for as long as possible, in order to keep precision, as floating point numbers should not be used for money arithmetics.<br>
With that in mind, the `convert` endpoint will return the result as a string instead of a number.<br>

After the system is running, you can check the docs for the API by going to `http://localhost:PORT/docs`. (the default port is 8080).<br>

As go doesn't have a project structure standard, I followed good practices from the community as well as the [effective go](https://go.dev/doc/effective_go) directives, and created this structure thinking about scalability and maintainability.

## Endpoints:
1. `/docs` - `GET` - API documentation.
2. `/api/v0/status` - `GET` - API Status.
3. `/api/v0/currencies` - `POST` - Creates a currency.
4. `/api/v0/currencies/{currency_code}` - `GET` - Gets (reads) a currency.
5. `/api/v0/currencies/{currency_code}` - `PATCH` - Updates a currency.
6. `/api/v0/currencies/{currency_code}` - `DELETE` - Deletes a currency.
7. `/api/v0/currencies/convert` - `GET` - Converts a value between two currencies.

## How to run
### 1:
Create your env vars. Or, if you prefer, add them to the .env file inside the `./cmd/env` directory.

### With raw PostgreSQL
### 2:
Create a new DB in PostgreSQL using the same values you added to your env vars and start PostgreSQL.

### With docker and docker compose
If you are using docker, you must set your env vars, as the docker compose won't fetch them from the .env file.
### 2.1:
Go to the `./docker` directory and run
```sh
docker-compose up
```

### 2.2:
Then run
```sh
docker start postgresql_challenge_bravo
```
in order to start PostgreSQL.

### 3:
Go to the `./cmd` directory and run
```sh
go run . -envfile -execds
```

The `-envfile` flag is used to start the program using the .env file. Omitting it will make the vars be fetched from the environment instead.<br>
The `-execds` will execute the [default schema](https://github.com/Pedro-Pessoa/challenge-bravo/cmd/default_schema.go). It is highly recommended to always pass this flag, and it is necessary to pass it the first time you are running the program, as it will set up the PostgreSQL table. It will also add the five default currencies (USD, BRL, EUR, BTC, ETH) to the database.<br>

That's it. You can now use the API. To see the documentation go to `http://localhost:PORT/docs`.

## Boilerplate
Two libraries that generates boilerplate code were used: [easyjson](https://github.com/mailru/easyjson) and [swaggo](https://github.com/swaggo/swag).<br>

Easyjson was used to marshal and unmarshal the [currency struct](https://github.com/Pedro-Pessoa/challenge-bravo/pkg/monetary/currency.go). The reason behind this decision was to speed up the HTTP requests, as the stdlib json package is not very fast. And this API needs to handle 1000 rps. The only boilerplate created by this library is the [monetary_easyjson.go](https://github.com/Pedro-Pessoa/challenge-bravo/pkg/monetary/monetary_easyjson.go) file.<br>

Swaggo was used to create the docs for the API. The reason behind this decision was scalability. We can add as many endpoints as necessary and document them easily by commenting the code with this system. All the boilerplate created by this library is inside the [docs](https://github.com/Pedro-Pessoa/challenge-bravo/staticfiles/docs) folder.

## Contributing
In order to contribute to this project, you are going to need to install two more binaries: [easyjson](https://github.com/mailru/easyjson) and [swaggo](https://github.com/swaggo/swag).<br>

You will find how to install them in their README's.<br>

PS: These steps are not needed to run the API, only to contribute to it.<br>

Then run
```sh
easyjson .
```
in the `./pkg/monetary` directory if you make any changes to the Currency struct.<br>
Also make sure to update the database schema.<br><br>

In order to generate docs, you will need to run
```sh
swag init -o ../staticfiles/docs --parseDependency
```
inside the `./cmd` directory.