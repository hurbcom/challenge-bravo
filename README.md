## Challenge-Bravo

> It's a solution to the challenge-bravo is API where you could add new currencies,
> delete, get and update them. It's been used the ***USD*** as base currency
> and the data about the currency is stored based on ***USD*** price.
>
> An external API is used to obtain the coins and store them, the scheduled job runs every
> 30 minutes in Redis and is saved in MongoDB.
>
> The data on redis will be used to convertions and store just the currency code
> and the value. The expiration time is set to 30 minutes.
>
> The data on MongoDB will be used to response the requests to get the complete data or
> to update/create the data.

## Run
> To run the application, just execute the make file the following command:
> - `make run` execute all the instances needed to the API runs
>
>>- `make test` executel all tests
>>- `make run_database` execute the database instance
>>- `make run_cache` execute the cache instance
>>- `make run_api` execute the api
>>- `make insert_migration` execute the migration to start db
>>- `make run_commander` execute the redis commander


### The chanllenge was created using the following technologies:

#### [GinConic](https://github.com/gin-gonic/gin)

    Used to handle the request and response of the API.

#### [Redis](https://github.com/go-redis/redis)

    Used to be easier to handle with Redis.

#### [godotenv](https://github.com/joho/godotenv)

    Load the environment variables to test the API.

#### [cron](https://github.com/robfig/cron/v3)

    Used to schedule the tasks to update the currencies.

#### [cron](https://github.com/stretchr/testify)

    Used to test the API.

#### [Mongo](https://go.mongodb.org/mongo-driver)

    Used to be easir handle with MongoDB.

#### [ExternalApi](https://economia.awesomeapi.com.br)

    Used to consult the currencies and get the refresh data.

#### [RedisCommander](https://joeferner.github.io/redis-commander/)

    Used to consult the data in Redis.

### Language: Golang, Docker

## Paths:

#### http://localhost:8080/api/v1/health/
>Methods:
>> GET
>
> Description:
>> Used to check the health of the API.


#### http://localhost:8080/api/v1/currency/
> ### Methods:
>> GET, POST
>
> ### Description:
>> Used to get all the currencies or create a new one.
To create a new one you need to send a JSON with the following fields:
> ```json
> {
>   "name": "Etherum",
>   "code": "ETH",
>   "price": 1
> }
> ```


#### http://localhost:8080/api/v1/currency/:id/
> ### Methods:
>> GET, PATCH, DELETE
> ### Description:
>> Used to get currency by code, update or delete it.
>
> To update, you need to send a JSON with the following fields:
> ```json
> {
>   "name": "Etherum",
>   "code": "ETH",
>   "price": 1
> }
> ```
> Exemple:
> - http://localhost:8080/api/v1/currency/BTC/


> ### http://localhost:8080/api/v1/conversion/
> ### Methods:
>> GET
> ### Description:
>> Used to get the conversion of a currency.
> ### Params:
>>- <i><b>from</b></i>: The currency code to convert from.
>>- <i><b>to</b></i>: The currency code to convert to.
>>- <i><b>amount</b></i>: The value to convert.
> Exemple:
>- http://localhost:8080/api/v1/conversion/?from=BTC&to=EUR&amount=123.45
