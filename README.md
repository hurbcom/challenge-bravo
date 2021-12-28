# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

[[English](README.md) | [Português](README.pt.md)]

A conversion API was developed to execute conversions between real currencies, cryptocurrencies, and user-created
currencies, all of which are pegged to the US dollar. The server makes use of the [CoinLayer](https://coinlayer.com),
[CurrencyLayer](https://currencylayer.com), and [Fixer](https://fixer.io) data providers, each of which has a free use
tier of around 1,000 requests per month for CoinLayer and CurrencyLayer, respectively, and 100 requests per month for
Fixer. Quotations for all services are delayed by at least one hour.

When the **bravo-server** is started, it downloads a list of all available currencies from quotation services and saves
it to the database and cache. Then, a job is started that runs immediately and then every eight hours to perform
currency quote cache updates.

[PostgreSQL](https://www.postgresql.org) is used as the database server, and [Redis](https://redis.io) is used as the
caching server. Go version 1.17 was used as the programming language, with the following libraries providing support:
- [Apitest](https://github.com/steinfletcher/apitest) - API testing library
- [Fiber](https://gofiber.io) - Framework for high-performance web request routing
- [Go-redis](https://github.com/go-redis/redis) - Client for the Redis server for Go
- [Scany](https://github.com/georgysavva/scany) - Converts the results of SQL queries to structs
- [Squirrel](https://github.com/Masterminds/squirrel) - Query Generator for SQL
- [Testify](https://github.com/stretchr/testify) - Test case tool

## Server startup

**bravo-server** can be configured using environment variables or the command line, with the command line values taking
precedence. The following lines summarizes the command line and environment parameters that are available:
- **-host** or **BRAVO_HOST** (optional) - Web server hostname, default is to listen all hosts
- **-port** or **BRAVO_PORT** (optional, default 8080) - Web server port number
- **-cert** or **BRAVO_CERT_FILE** (optional) - Certificate .pem file path for https connections
- **-key** or **BRAVO_KEY_FILE** (optional) - Certificate key .key file path for https connections
- **-db** or **BRAVO_DB** - Postgres connection string ex: postgres://user:password@url:5432/database
- **-cache** or **BRAVO_CACHE** - Redis server connection string ex: redis://url:6379/0
- **-coin-layer** or **BRAVO_COIN_LAYER_KEY** - CoinLayer service key
- **-currency-layer** or **BRAVO_CURRENCY_LAYER_KEY** - CurrencyLayer service key
- **-fixer** or **BRAVO_FIXER_KEY** - Fixer service key
- **-help** - Print help

The ``deployments`` folder contains configuration files for the application, its unit tests, database and cache servers,
as well as PostgreSQL administration all in Docker containers. If you need to make any configuration changes, such as
changing the service keys, you must update the ``docker-composer.yml`` file, which contains the environment variables.

Execute the following commands to start the application:
- ``git clone https://github.com/aandrade1234/challenge-bravo.git``
- ``cd challenge-bravo``
- ``chmod +x server.sh``
- ``.\server.sh``

Run the following commands after the previous ones to run the application tests:
- ``docker exec bravo go test -v challenge-bravo/server``

### Troubleshooting

If the ``bravo`` service enters a restart cycle as a result of a database connection failure caused by an authentication
failure. The issue could be caused by an out-of-date database server image. To resolve the issue, you must delete all
Postgres related images and volumes and restart the services; however, do not forget to perform a backup of any data
included in these volumes.

## API usage

Utilization of APIs

The default **bravo-server** endpoint is http://127.0.0.1:8080/api/v1. It provides two services: ``/currency`` for
currency management and ``/convert`` for currency conversion. All requests conform to the REST protocol, and the data
is presented in the JSON format.

The following attributes and rules apply to a currency representation in the API:
- ``code``: Currency code, always in capital letters and consisting of three digits for real currencies and one to ten
for cryptocurrencies and custom currencies. It may have simply letters in the case of real currencies, or it may
comprise letters, numbers, and * in the case of all other types of currencies. It is not permitted to change a currency
code.
- ``name``: Currency name: up to 100 characters of any type may be included in the currency name.
- ``type``: Currency type, where ``C`` denotes real currency, ``Y`` denotes cryptocurrency, and ``U`` denotes custom
currency. This is a query-only attribute and is not required when creating or updating a currency.
- ``rate``: currency exchange rate with relation to the US dollar. This property is available only for custom currencies.

### Services

#### /currency - Currency management

- **GET ``/currency``** - Returns a list of all available currencies for conversion.


- **POST ``/currency``** - Create a custom currency, the requisition body must contain a currency representation. If
``type`` attribute is present it will be ignored.
    - **Example:**<code>curl --location --request POST 'localhost:8080/api/v1/currency' --header 'Content-Type: application/json' --data-raw '{
      "code": "HURB",
      "name": "Hurb Coin",
      "rate": 2.5
      }'</code>

- **GET ``/currency/{code}``** - Return a currency.


- **DEL ``/currency/{code}``** - Delete a custom currency.


- **PUT``/currency/{code}``** - Update a custom currency, the request body must include a currency representation. The
``type`` attribute will be ignored if it is present. Also, it is not allowed to edit the code attribute.

#### /convert - Currency conversion

- **GET ``/convert``** - Converts two currencies; the parameters for this request must be passed as a querystring and
include the following: ``amount`` the amount to be converted ``from`` the source currency code ``to`` the destination
currency code ``verbose`` an optional parameter that, when set to true, returns additional debugging information.
    - **Example:**<code>curl --location --request GET 'localhost:8080/api/v1/convert?amount=10.5&from=HURB&to=ARS&verbose=true'</code>

## Stress test

[Φορτίο](https://github.com/fortio/fortio) was introduced to perform stress tests on **bravo-server**. Execute the
following command to run the test:
- <code>docker exec -it fortio fortio load -qps 1500 -c 8 -t 20s "http://host.docker.internal:8080/api/v1/convert?amount=10.5&from=USD&to=BRL" </code>

The test above have the following parameters:
- Desired transactions per second = 1,500
- Number of processes = 8
- Duration of the test = 20s

The following results were obtained on a notebook with an Intel Core I7 10510U processor and 16GB of RAM memory:
- Total requests: 22,251
- Average request time: 7.174 milliseconds
- Requests per second: 1,112.3

Additionally, the program includes a graphical interface that may be accessible via the browser at
http://localhost:8088/fortio/, from which it is possible to generate graphical reports such as the one shown below.

<p>
  <img src="histogram.png" alt="Histrograma" style="background-color: white" />
</p>

## Doubts

If you have any doubts or encounter any problems, please consult or submit them in the
[project issues](https://github.com/aandrade1234/challenge-bravo/issues).
