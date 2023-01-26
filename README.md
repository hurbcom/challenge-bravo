# Cuco API
### The Currency Conversion API

## Introduction

This API was developed as an iteration of this challenge. The goal was to create an API that could convert between various currencies, both real and fictional, with live and custom values. My version of the API allows for the addition of new real currencies that will be tracked and fictional currencies that will be stored. Additionally, it should be noted that the API's base currency is USD.

For obtaining the latest currency exchange rates, I chose to use the Open Exchange Rate API. The reasons for this choice include:
- The exchange rates are updated hourly, which is a suitable frequency for a free API.
- The rate limit is 1000 requests per month, which should be sufficient for a month's worth of usage with some leeway.
- It offers a wide variety of currencies, including those required for the challenge.

The requirement for adding and removing currencies through HTTP verbs was interpreted by me as a need to save the currency values in the database. However, I still allow users to request currencies that have not been added, but I can't guarantee that they will always be available. Additionally, when creating a fictional currency with the same symbol as a real currency, the new fictional currency takes precedence. For manipulation of the currencies, such as add, update and delete, an admin user is needed. Thus, I develop a basic User and Role system. 

To store the Currencies, the Users and the Roles, I am using the MySQL database. This choice was made due to its high performance and ease of integration.

For the 1000 requests per second requirement and to further improve the API's performance, I also implemented Redis for caching and reducing latency. I am using Redis to store the last updated dollar value of currencies and a list of available currencies (used to verify if the currency is available on the API or not).

To ensure high throughput, I designed the API to be able to run as a distributed system. For this, I am using Redis for a distributed lock system to prevent the API from using deprecated values when updating currencies. I am also using Nginx, which is responsible for distributing requests among servers using the Round Robin strategy, to ensure that each server is receiving an even load.

Lastly, I added a Cronjob to periodically update the currency exchange rates. This job is responsible for sending a request to the endpoint that starts the synchronization process and is called again once an hour has passed since the last update. This ensures that the API always has the most up-to-date rates available.

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
This command will build the API and its dependencies (*MySQL, Redis, Nginx*) and start them up as containers.
The Load Balancer will be running on port 5100, and you can test if the API is working by making a GET request to http://localhost:5100/api/test/ping

I've provided an example .env file, which will be used to set up the environment variables inside the API and other servers. However, I recommend taking up some time to change them.
You can use my App Id for the Open Exchange Rate, however, I do not guarantee that it will have any more uses left for this month. Therefore, I recommend you create your own [here](https://openexchangerates.org/).
Other than that, a user called "ADMIN" with the password 9DdrS0qILyA!X4Zu5 is created when running the API for the first time. I strongly recommend changing the password as soon as possible.

## Endpoints

### Convert
#### GET /api/currency/convert:
Converts a given amount of money from one currency to another. The endpoint accepts the following query parameters:
- from: the symbol of the currency to convert from (ex: USD, BRL)
- to: the symbol of the currency to convert to (ex: EUR, BTC)
- amount: the amount of money to convert

Example: GET /api/currency/convert?from=BTC&to=BRL&amount=100

Returns a JSON object with the converted amount and details of the conversion:
```JSON
{
  "converted_amount": 117471.26705042095,
  "details": "Successfully converted from BTC to BRL"
}
```

### Currency
#### GET /api/currency/all:
Retrieves a list of all currencies supported by the API.

Example: GET /api/currency/all
- Returns a JSON array with the symbols of all supported currencies:
```JSON
[
  {
    "symbol": "USD",
    "name": "Dollar",
    "value_in_dollar": 1,
    "last_update_at": "2023-01-26T06:00:00",
    "is_available": true
  },
  {
    "symbol": "BRL",
    "name": "Real",
    "value_in_dollar": 5.0736,
    "last_update_at": "2023-01-26T06:00:00",
    "is_available": true
  }
]
```

#### POST /api/currency: ADMIN-ONLY 
Adds a new currency to the list of supported currencies. 
- The endpoint accepts a JSON object with the following properties:
  - name: The full name of the currency;
  - symbol: The symbol that represents the currency;
  - base_currency_symbol: The currency symbol used to create the new currency;
  - value_in_base_currency: The new currency value from the base currency;
  - is_real: If you want to add this as a live currency;
  
Example: 
```JSON
{
  "name": "Dungeons & Dragons",
  "symbol": "D&D",
  "base_currency_symbol": "brl",
  "value_in_base_currency": 0.10,
  "is_real": false
}
```

#### PUT /api/currency/: ADMIN-ONLY 
Adds a new currency to the list of supported currencies. 
- The endpoint accepts a JSON object with the following properties:
  - name: The updated full name of the currency;
  - symbol: What will be used to find the currency to be changed.
  - base_currency_symbol: The currency symbol used to update the currency;
  - base_currency_symbol: The updated currency value from the base currency;
  
Example: 
```JSON
{
  "name": "Dungeons & Dragons (GC)",
  "symbol": "D&D",
  "base_currency_symbol": "usd",
  "value_in_base_currency": 0.1
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
The API uses JWT tokens for authentication and authorization. The tokens are passed in the headers of every request and are required for accessing some endpoints of the API.
The User's password is encrypted using BCrypt and is never returned.
All sensitive data, such as connection strings and API keys, are stored as environment variables and are not hardcoded in the code.

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

## Final Considerations

I learned a lot while doing this application, how to orchestrate a system, for instance, it was also the first time I had to completely set up a solution, and also the first time I tried to tackle building a distributed system. With the knowledge I have acquired, I am confident that I could take on new challenges and complete tasks more efficiently in the future. Making this project was an amazing journey, and I hope that I continue this journey with the people from Hurb! Either way, I am very grateful for the opportunity, and for what I have learned through this project too.

### Improvements:
- System Design:
  - The design that I chose for the API does not work that well (or I couldn't make it work) within a containerized solution;
  - Taking that into account, a lighter database could be used, and the currencies could be updated from the API itself.
  - In a production environment, other services such as AWS, Azure, and Google Cloud, would be used, which would be better for this solution.
- Resilience:
  - I could have added more Retries and Circuit-Breaks. As it is now, it is only used by the cronjob, but it would be useful for accessing the external API. For example.
- Logging:
  - The Application currently does not have any logging system. Therefore, it is not a production-ready code.
  - Thus, a very necessary improvement would be to add logging.
- Better Exception Handling:
  - Right now the application is not as clear as it could be with the possible exceptions that it could throw.
  - For that, and for clearer returns, Language Extensions' Result type could help.
- Integration Tests:
  - Integration tests are an essential part of software development, and important for production-ready solutions.
- Identity:
  - Using Identity for handling Users.

### Auto-Generated Code:
- Migrations:
  - Used the Add-Migration tool to simplify the creation of entities and insertion of data;
  - I had to configure the entities, but the entity migrations themselves were auto-generated.
- .NET 6 Web API:
  - When creating a Web API in .NET, some files are added, such as:
    - Program.cs:
      - It has been modified by me but was initially auto-generated.
    - .csproj files;
    - .sln file;
    - appsettings.json
      - It has been modified by me.
    - Dockerfile
      - It was created when generating the initial solution, but I removed it and made my own.
    - launchsettings.json
- Code clean-up:
  - Sometimes I ran the code clean-up tool, native to the IDE;
  - It is not auto-generated code, but it is a tool that manipulates the code.



