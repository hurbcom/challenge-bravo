# Challenge Bravo
[[English](README.md) | [Portuguese](README.pt.md)]

# Introduction
The project goal is to provide a public API responsible for currency conversion (USD, BRL, EUR, ETH, BTC) that have a backing currency (USD), making it possible to create, read, update and delete real currencies (FIAT), cryptos and fictitious.

### API
[https://challengebravo-assisthiago.herokuapp.com/](https://challengebravo-assisthiago.herokuapp.com/)

![Default home view](screen-shot_api-home.png?raw=True "API Home")

### Main features

* Conversion between two currencies (FIAT, Crypto or Fiction).

* Creating, reading, updating and deleting currency.

* Routine for automatic updating of real currency rates.

# Quickstart
First clone the project repository from [Github](https://github.com/assisthiago/challenge-bravo) and switch to the new directory:
```bash
$ git clone git@github.com:assisthiago/challenge-bravo.git
$ cd challenge-bravo
```

Create a virtualenv for your project on the root directory and active:
```bash
$ python3 -m venv .venv
$ source .venv/bin/active
```

Install project dependecies:
```bash
$ pip install -r requirements.txt
```

Then simply apply the migrations:
```bash
$ python manage.py migrate
```

Copy the file `.env-sample` from `contrib/` to project root:
```bash
$ cp contrib/.env-sample .env
```

You can now run the development server:
```bash
$ python manage.py runserver
```

_OPTIONAL_. If you want to add some initial data, simply run:
```bash
$ python manage.py loaddata exchange/core/fixtures/currencies.json
Installed 7 object(s) from 1 fixture(s)
```

# Docker

Update the copied file `.env` to:
```
# DJANGO SETTINGS
DEBUG=True
ALLOWED_HOSTS=127.0.0.1, localhost
CACHE_TIMEOUT_IN_SECONDS=30
SCHEDULER_TIMEOUT_IN_MINUTES=1

# API
API_COINBASE_BACKED_TO_USD=https://api.coinbase.com/v2/exchange-rates/?currency=USD

# === DOCKER REQUIRED ===
# -- Comment these variables to run locally with `$ python manage.py runserver`
# -- Uncomment these variables to run locally with `$ docker-compose run --build`

# DATABASE
DATABASE_URL=postgresql://admin:1q2w3e4r@db:5432/development

# CACHE
CACHE_BACKEND=django.core.cache.backends.redis.RedisCache
CACHE_LOCATION=redis://cache:6379
```

You can now run:
```bash
$ docker-compose up --build
...
challenge-bravo-api-1    | System check identified no issues (0 silenced).
challenge-bravo-api-1    | December 19, 2022 - 14:56:04
challenge-bravo-api-1    | Django version 4.1.4, using settings 'exchange.settings'
challenge-bravo-api-1    | Starting development server at http://0.0.0.0:8000/
challenge-bravo-api-1    | Quit the server with CONTROL-C.
```

Open the project link [http://localhost:8000/](http://localhost:8000/).

# Tests

### Units
```bash
$ python manage.py test

Found 54 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
......................................................
----------------------------------------------------------------------
Ran 54 tests in 1.148s

OK
Destroying test database for alias 'default'...
```

_OBSERVATION_. Do not forget to comment the variables on `.env` file to run these tests.
```
# DATABASE
# DATABASE_URL=postgresql://admin:1q2w3e4r@db:5432/development

# CACHE
# CACHE_BACKEND=django.core.cache.backends.redis.RedisCache
# CACHE_LOCATION=redis://cache:6379
```

### Load
Follow the instructions for install the [k6](https://k6.io/) and then run:
```bash
$ k6 run test_load_k6.js
```

![Default test-load view](screen-shot_test-load.png?raw=True "Test load")

_WARNING_. The _k6_ uses ~1-5MB per VU (virtual user). In these scenario we use 10000VUs (~1-5GB).

### Coverage
```bash
$ coverage run --source='.' manage.py test && coverage report

Found 54 test(s).
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
......................................................
----------------------------------------------------------------------
Ran 54 tests in 1.148s

OK
Destroying test database for alias 'default'...
Name                                                      Stmts   Miss  Cover
-----------------------------------------------------------------------------
contrib/__init__.py                                           0      0   100%
contrib/secret_gen.py                                         5      0   100%
exchange/__init__.py                                          0      0   100%
exchange/asgi.py                                              4      4     0%
exchange/coinbase/__init__.py                                 0      0   100%
exchange/coinbase/apps.py                                     8      0   100%
exchange/coinbase/schedulers.py                               8      0   100%
exchange/coinbase/tests.py                                    9      0   100%
exchange/coinbase/views.py                                   23      4    83%
exchange/core/__init__.py                                     0      0   100%
exchange/core/apps.py                                         4      0   100%
exchange/core/managers.py                                     4      0   100%
exchange/core/migrations/0001_initial.py                      5      0   100%
exchange/core/migrations/0002_alter_currency_options.py       4      0   100%
exchange/core/migrations/__init__.py                          0      0   100%
exchange/core/models.py                                      21      0   100%
exchange/core/serializers.py                                 28      0   100%
exchange/core/tests/__init__.py                               0      0   100%
exchange/core/tests/test_currency_convert_views.py           57      0   100%
exchange/core/tests/test_currency_detail_views.py            68      0   100%
exchange/core/tests/test_currency_list_views.py              51      0   100%
exchange/core/tests/test_models.py                           23      0   100%
exchange/core/tests/test_serializers.py                      53      0   100%
exchange/core/validators.py                                  24      0   100%
exchange/core/views.py                                       39      3    92%
exchange/settings.py                                         26      0   100%
exchange/urls.py                                              7      0   100%
exchange/wsgi.py                                              5      5     0%
manage.py                                                    12      2    83%
-----------------------------------------------------------------------------
TOTAL                                                       488     18    96%
```
