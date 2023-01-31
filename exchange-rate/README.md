## Setup .env

Env file holds important configuration, including api keys for exchange rate APIS.

For Fixer api key go to (here)[https://fixer.io/]
For Abstract api key to go (here)[https://app.abstractapi.com/]

Here is the skeleton:

```
    REDIS_URL=redis://exchange-rate-redis:6379/0
    FIXER_URL=https://api.apilayer.com/fixer/latest
    FIXER_API_KEY=<api_key>
    ABSTRACT_URL=https://exchange-rates.abstractapi.com/v1/
    ABSTRACT_API_KEY=<api_key>
```