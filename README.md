Hurb Challenge Bravo
=================================================
[![Build Status](https://semaphoreci.com/api/v1/mariojrrc/challenge-bravo/branches/master/badge.svg)](https://semaphoreci.com/mariojrrc/geonames-api-mezzio)

This project is an example of REST API written in PHP 7.4 to handle currency conversion. It is result of the [Hurb Challenge Bravo](https://github.com/hurbcom/challenge-bravo).
The project makes use of [Swoole](https://www.swoole.co.uk/docs/) to handle at least 1000 requests per second. It also uses [Crypto Compare API](https://min-api.cryptocompare.com/) to fetch data from.

It basically has two endpoints that allow us to perform some CRUD operations:

- /v1/exchange/{fromCurrency}/{toCurrency}/{amount}
- /v1/currency

The endpoints are protected by authorization header tokens in the following format `X-Api-Key: uuid`. It has two types of tokens defined in the file `.env` on project's root folder. One token is to perform some "Admin level" operations, such as create, update and delete. And the other one is to perform only read operations.

Note: Tokens committed to this repo for are for testing purpose only. For production environment, credentials should not be available in your version control.
Note: Tokens have rate-limit params defined. You can configure them in `config/autoload/api-credentials.global.php` file. By default, it allow us to perform 2000 requests per second.

## DOCS
The endpoint's documentation is located in `public/doc` folder. It was written on top of OpenAPI v3 notation.

## Running the project

**Using it with Docker**
1. `docker-compose up`
2. `docker exec -t challenge-bravo-php bash -c 'PHINX_DBHOST=challenge-bravo-mysql PHINX_DBUSER=mario PHINX_DBPASS=mariocosta ./vendor/bin/phinx migrate'`
3. Make calls to the endpoints via [Postman](https://www.getpostman.com/) or similar in the following address `0.0.0.0:8080/health` to check if it's live.

** Using without docker. OBS: PHP 7.4, MySQL, and [Swoole](https://www.swoole.co.uk/docs/) extensions are required**
1. Rename the file `.env.dist` to `.env` and fill out the required info
2. Run `composer install`
3. Run `./vendor/bin/mezzio-swoole start or composer serve`
4. Make calls to the endpoints via [Postman](https://www.getpostman.com/) or similar in the following address `0.0.0.0:8080/v1/health`

## CI/CD
There is a configured pipeline in [SemaphoreCI](http://semaphoreci.com/) to run some code style validations ([PHPCS](https://github.com/squizlabs/PHP_CodeSniffer) and [PHPStan](https://github.com/phpstan/phpstan)) and Unit tests.

## Questions and Suggestions?
Drop me an [e-mail](mailto:mariojr.rcosta@gmail.com)

## TODO
- Fetch api tokens from database (cached) in order to keep it more easily to maintain
- Create more unit tests to have a 100% coverage score.
