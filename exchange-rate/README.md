# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


## Setup .env

Env file holds important configuration, including api keys for exchange rate APIS.

For Fixer api key go to (here)[https://fixer.io/]
For Abstract api key to go (here)[]

Here is the skeleton:

```
    REDIS_URL=redis://exchange-rate-redis:6379/0
    FIXER_URL=https://api.apilayer.com/fixer/latest
    FIXER_API_KEY=<api_key>
    ABSTRACT_URL=https://exchange-rates.abstractapi.com/v1/
    ABSTRACT_API_KEY=<api_key>
```