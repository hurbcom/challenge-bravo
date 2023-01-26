# Cuco API
### The Currency Conversion API

## Introduction

This API was created an iteration to [this challenge](https://github.com/hurbcom/challenge-bravo).
The goal was to develop an API capable of converting between currencies, both real, being updated live, and imaginary, with custom values.
My iteration of the API allows addition of new real currencies that will be tracked and imaginary ones, that will be saved.
Furthermore, it should be said that the API base currency is the USD.

The public currency quote API that I chose was Open Exchange Rate. The choice was due to the following reasons:
- The exchange rates are updated hourly, which is a good rate for a free API.
- The rate limit is 1000 per month, which should allow for enough request for a month, plus some leniency.
- It has currencies available, including the ones required for the challenge.

For a security measure, in order for not everyone to be able to add and remove currencies, authorization to the necessary endpoints were added, using JWT and a custom User and Role system, a token is generated that can be used to acces those endpoints.
The requirement that currencies should be added to the API through an endpoint using HTTP verbs were interpreted by me as, the values for those currencies should be saved. However, I still allow the user to request a currency that he hasn't added, but I don't guarantee that it will be available at most times. Also, when you create an imaginary currency with the same symbol as a real one, the new imaginary currency takes priority.
For the User and Role system and to save the currencies that are added, I am using the Database *MySQL*. The choice of the database was due to its high performance and easier integration.

For that *Redis* is used. I chose redis for its caching capabilities, decreasing latency. I use Redis for saving the currencies last updated value in Dollar, a list of the available currencies (used for verifying if the currency is available on the API or not).

Since the API should have a high throughput, some other decisions were made. I built the API to be able to run as a distributed system. For that I use Redis, for a distributed lock system, so as to not allow the API to get deprecated values when the currencies are being updated. I also *Nginx*, which is responsible for sending the requests to the servers using the *Round Robin* strategy, to be sure each server is getting an even load.

For updating the currencies' exchange rate, I added a Cronjob, this cronjob is responsible for sending a request to the endpoint that starts the syncrhonization process. Then, it is called again once an hour pass after the last udpate has been made. In order to always have the most up-to-date rate available.


## Getting Started
To run the API, you will need to have Docker (and docker-compose) installed.

Once Docker is installed, you can clone this repository:
``` sh
git clone https://github.com/LukeDias42/challenge-bravo/
```
and then navigate to the directory created.
Run the following command to build and start the containers:

``` sh
docker-compose up --build -d
```
After you finish testing, to remove the containers from your computer simply run:
``` sh
docker-compose down
```
This command will build the API and its dependencies (MySQL, Redis, nginx) and start them up as containers.
The Load Balancer will be running on port 5100, and you can test if the API is working by making a GET request to http://localhost:5100/api/test/ping

I've provided an example .env file, which will be used to set up the environment variables inside the API and other servers. However, I recommend taking up some time to change them.
You can use my App Id for the Open Exchange Rate, however I do not guarantee if it will have any more uses left for this month. Thus, I recommend you create your own [here](https://openexchangerates.org/).
Othe than that, a user called "ADMIN" with the password 9DdrS0qILyA!X4Zu5 is created when running the API the first time. I strongly recommend changing the password as soon as possible.

## Endpoints

### Convert
#### GET /api/currency/convert:
Converts a given amount of money from one currency to another. The endpoint accepts the following query parameters:
- from: the symbol of the currency to convert from (ex: USD, BRL)
- to: the symbol of the currency to convert to (ex: EUR, BTC)
- amount: the amount of money to convert
Example: GET /api/currency/convert?from=USD&to=BRL&amount=100
Returns a JSON object with the converted amount and details of the conversion:
```JSON
{
    "output": {
        "convertedAmount": 100.00,
        "details": "Successfully converted from USD to BRL"
    }
}
```

### Currency
#### GET /api/currency/all:
Retrieves a list of all currencies supported by the API.
- Example: GET /api/currency/all
- Returns a JSON array with the symbols of all supported currencies:
```JSON
{
    "output": [
        {
            "symbol": "USD",
            "name": "Dollar",
            "valueInDollar": 1.0000000000000000000000000000,
            "lastUpdateAt": "2023-01-25T09:00:00",
            "available": true,
        },
        {
            "symbol": "BRL",
            "name": "Real",
            "valueInDollar": 5.1391000000000000000000000000,
            "lastUpdateAt": "2023-01-25T09:00:00",
            "available": true,
            "id": 2
        }
    ]
}
```

#### POST /api/currency: ADMIN-ONLY 
Adds a new currency to the list of supported currencies. 
- The endpoint accepts a JSON object with the following properties:
  - name: The full name of the currency;
  - symbol: The symbol that represents the currency;
  - baseCurrencySymbol: The currency symbol used to create the new currency;
  - baseCurrencyValue: The new currency value from the base currency;
  - isReal: If you want to add this as a live currency;
Example: 
```JSON
{
  "name": "Dungeons & Dragons' Gold Coin",
  "symbol": "G&C",
  "baseCurrencySymbol": "BTC",
  "baseCurrencyValue": 0.00004,
  "isReal": false
}
```

#### PUT /api/currency/{symbol}: ADMIN-ONLY 
Adds a new currency to the list of supported currencies. 
- The endpoint accepts a JSON object with the following properties:
  - name: The updated full name of the currency;
  - baseCurrencySymbol: The currency symbol used to update the currency;
  - baseCurrencyValue: The updated currency value from the base currency;
Example: 
```JSON
{
  "name": "Dungeons & Dragons' Gold Coin",
  "baseCurrencySymbol": "ETH",
  "baseCurrencyValue": 0.002,
}
```

#### DELETE /api/currency/{symbol}: ADMIN-ONLY
Removes a currency from the list of supported currencies. The endpoint accepts the symbol of the currency to remove as a path parameter.
Example: DELETE /api/currency/D&D

### Auth
#### PUT /api/auth/Authenticate:
Generates a token for the user to be used on necessary endpoints.
Example:
```JSON
{
  "name": "ADMIN",
  "password": "9DdrS0qILyA!X4Zu5"
}
```
Returns a JSON object with the token:
```JSON
{
  "token": "..."
}
```
### User
#### POST /api/user: ADMIN-ONLY
Creates a new user with the specified role.
Example:
```JSON
{
  "name": "new_user",
  "password": "new_password",
  "role": 1
}
```
##### Note:
- Check RoleNames for currently available roles.

#### PUT /api/user/{name}
Updates the Password of the logged User;
Example:
```JSON
{
  "newPassword": "update_password"
}
```

#### DELETE /api/user/{name}: ADMIN-ONLY
Deletes the user with the specified name.
##### Note:
- Cannot delete "ADMIN", the base administrator.

## Security
The API uses authentication for both MySQL and Redis to prevent unauthorized access. The connection strings for these databases are stored as environment variables and are not hardcoded in the code.
Additionally, the API has been built with security best practices in mind, such as input validation and error handling.
It is important to note that the API is only accessible over a secure network and should not be exposed to the public internet.

## Stack
|   Tool  |   Description  |
| --- | --- |
| C# | Language |
| .NET 6 | Web Framework |
| [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/) | ORM Framework |
| [Pomelo](https://github.com/PomeloFoundation/Pomelo.EntityFrameworkCore.MySql) | ORM with MySQL |
| [Polly](https://github.com/App-vNext/Polly) | Retry |
| [Moq](https://github.com/moq/moq4) | Mock |
| [NUnit](https://nunit.org/) | Unit Test |
| [Flurl](https://flurl.dev/) | Http Requests |
| [Swagger](https://swagger.io/docs/) | API Cocumentation |
| [Redis](https://redis.io/docs/) | Caching |
| [MySQL](https://www.mysql.com/) | Main Database |
| [Nginx](https://www.nginx.com/) | Load Balancer |
| [Docker](https://www.docker.com/) | Container Creation |
