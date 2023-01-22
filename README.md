# Cuco API
### The Currency Conversion API

## Introduction

This API is designed to provide a simple solution for currency conversion. 
The API has a backing currency of USD and can convert between different currencies with real and live values. 
The API supports the following currencies: 

- USD
- BRL
- EUR
- BTC
- ETH 

Additional currencies, both real and imaginary, can be added as needed.

## Getting Started - NOT IMPLEMENTED
To run the API, you will need to have Docker installed.

Once Docker is installed, you can clone this repository and navigate to the root directory.
Run the following command to build and start the containers:

``` bash
docker-compose up --build
```

This command will build the API and its dependencies (MySQL and Redis) and start them up as containers.
The API will be running on port 5100, and you can access the API endpoint by making a request to http://localhost:5100/api/

Please make sure to have the appsettings.json file properly configured with the necessary environment variables. You can also a edit the .env file with the required settings. 

## Security
The API uses authentication for both MySQL and Redis to prevent unauthorized access. The connection strings for these databases are stored as environment variables and are not hardcoded in the code.
Additionally, the API has been built with security best practices in mind, such as input validation and error handling.
It is important to note that the API is only accessible over a secure network and should not be exposed to the public internet.

## Stack
- The application is built using .NET 6 and C#
- It uses Entity Framework Core for database access, connecting to a MySQL instance
- Redis is used for caching
- The application uses Flurl for HTTP requests and Open Exchange Rates API for currency conversion rates
- For testing, the application utilizes NUnit and Moq
- The application is containerized using Docker, with a docker-compose file provided for easy setup
- The application is deployed behind an NGINX reverse proxy for load balancing and SSL termination
- The application also makes use of the dotenv library for handling environment variables.
