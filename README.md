# Challenge-bravo (_aka CurAPI Service_)

**CurAPI** is an service that offers Currency Conversion on demand with updated rates from Forex and Exchanges.

This project is written in Go and use these thirdy-party libraries:

* **gorilla/mux** - a nice http framework (mux library)
* **fresh** - offers _live reloading_ for better development
* **bigcache** - fast, concurrent, evicting in-memory cache
* **cron** - package that  implements a cron spec parser and job runner
* **logrus** - a structured logger for Go
* **jsoniter** - a high-performance 100% compatible drop-in replacement of _"encoding/json"_

## Architeture

![curapi-arch](https://i.imgur.com/ZsLx1e7.jpg)

The architeture was constructed only using Golang and have three main modules:

* **API Service**
* **Cache Service**
* **Worker Manager**

### API Service

The API Service was built using **Gorilla HTTP Framework**. It's a simple api that returns converted currency in JSON format.

### Cache Service

The Cache service was built using **BigCache** library. It's a fast, concurrent and evicting in-memory cache.
Why this solution instead of solutions like Redis, memcached, etc?
For better performance: mainly because of additional time needed on the network using external cache solutions.
*See more:* <https://allegro.tech/2016/03/writing-fast-cache-service-in-go.html>

### Worker Manager

The Worker manager is fantastically simple. With help of **cron** library, it's schedule jobs on separated _goroutines_ to periodicaly (_time is inputed by user_) update the rates.

## Requirements

* Docker (18.03+)
* Docker Compose (1.19+)

## Installation & Run Development Environment

```bash
# Clone this project
git clone https://github.com/thiagomorales/challenge-bravo
cd challenge-bravo

# To list available comands type: make

# First, you need to build Docker image
make build

# So, you can run app in development environment
make run-dev
```

This will run an **Docker Go** development environment in **default** port **(8080)** with default timeout **(30)**.

If you want to run your server in other port and customize update rate interval, use this:

```bash
# Change '8082' to your desired port and '20' to your desired update rate interval
make run-dev HOST_PORT=8082 TIMEOUT=20
```

## Run Development environment with Live Reloading

The **fresh** library offers live reloading feature. It watches project dir for changes, and re-run the app automatically as soon as there is any change in project files.

```bash
# So you can run following:
make run-dev-live
```


## Run Production environment

```bash
# You need to run make build first as usual
make build

# So you can run following:
make run

# You also can use HOST_PORT and TIMEOUT variables in Production environment run (like Development)
make run HOST_PORT=8080 TIMEOUT=30
```

### Additional notes

This API server consume rates from external resources like **_RatesAPI (<https://ratesapi.io>)_** and **_Coinbase (<https://coinbase.com>)_**.

## Project Structure

```text
├── api
|   ├── handlers
│   |   └── api.go       // API handlers
|   └── server
│       └── server.go    // API Server package
├── cache
│   └── cache.go         // Package for Cache Service Module
├── config
│   └── config.go        // Package to store global config data
├── converter
│   └── converter.go     // Package responsible to do the Currency Converter
├── logger
│   ├── formatter.go     // Custom own logrus formatter
│   └── logger.go        // Main logger module (logrus)
├── rates
│   └── rates.go         // Package to Fetch, Collect and Update Rates
├── util
│   └── rest.go          // Package for helpers and utilitary functions
├── worker
│   └── worker.go        // Package for Worker Manager Module
│
├── .env                 // Default environment variables used by Docker-Compose
├── .docker-compose.yml  // Docker Development Environment config file
├── Dockerfile           // Docker config file used to build image
├── Gopkg.lock           // Go dep file used to lock dependecies versions
├── Gopkg.toml           // File with go dep constraints
├── Makefile             // Makefile used to build, run and test service
├── README.md            // This Readme file ;)
├── runner.config        // Config file for fresh (live reloading feature)
└── curapi.go            // Main service Go file
```

## API Endpoints

#### /health

* `GET` : Get server status (health check)

#### /api/v1/public/convert

* `GET` : Retrieve currency conversion for desired amount

**Usage:**

This endpoint accepts **_THREE_** parameters (**passed as querystring**), and **all of them must be informed**:

* **FROM:** from currency symbol (origin) - _insensitive case_

```text
?FROM=BRL
```

* **TO:** symbol of currency that will be converted - _insensitive case_

```text
?TO=BTC
```

* **AMOUNT:** the amount that will be converted

```text
?AMOUNT=25300
```

**Please note:** This field accepts integer or float numbers (_use dots_). **_DO NOT use comma as decimal places._**

* `GET /api/v1/public/convert?from=BRL&to=btc&amount=25300`

##### Expected response

```json
{
    "base": "USD",
    "from": {
        "symbol": "BRL",
        "description": "Brazilian Real"
    },
    "to": {
        "symbol": "BTC",
        "description": "Bitcoin"
    },
    "value": 1.70057088
}
```

#### /api/v1/public/rates

* `GET` : Retrieve all currently rates, USD based.

* `GET /api/v1/public/rates`

##### Expected response

```json
{
    "base": "USD",
    "updated_at": "2019-01-08T20:49:11Z",
    "rates": {
        "NZD": "1.4880",
        "ILS": "3.6986",
        "ISK": "118.9685",
        "KRW": "1126.4161",
        "CNY": "6.8536",
        "MXN": "19.3705",
        "SGD": "1.3592",
        "ETH": "0.00671456",
        "HUF": "281.5997",
        "PLN": "3.7635",
        "USD": "1",
        "PHP": "52.4974",
        "THB": "32.0848",
        "BTC": "0.00025032",
        "HRK": "6.4944",
        "HKD": "7.8384",
        "RON": "4.0830",
        "BRL": "3.7241",
        "CHF": "0.9818",
        "RUB": "67.0627",
        "CAD": "1.3294",
        "AUD": "1.4023",
        "GBP": "0.7845",
        "INR": "70.1442",
        "NOK": "8.5446",
        "SEK": "8.9034",
        "DKK": "6.5265",
        "MYR": "4.1130",
        "JPY": "108.7937",
        "EUR": "0.8741",
        "TRY": "5.4940",
        "CZK": "22.4143",
        "ZAR": "14.0179",
        "IDR": "14145.0000",
        "BGN": "1.7096"
    }
}
```

#### Supported Currencies (Symbol)

```text
"NZD","ILS","ISK","KRW","CNY","MXN","SGD","ETH","HUF","PLN","USD","PHP","THB","BTC","HRK","HKD","RON","BRL",
"CHF","RUB","CAD","AUD","GBP","INR","NOK","SEK","DKK","MYR","JPY","EUR","TRY","CZK","ZAR","IDR","BGN"
```

## Todo

- [ ] Write the tests for all APIs.