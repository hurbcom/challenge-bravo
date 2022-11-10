# How to run?

1. Clone the repository
```sh
$ git clone https://github.com/victorananias/challenge-bravo.git
```
2. cd repository
```sh
$ cd challenge-bravo
```
3. Run
```sh
$ docker compose up
```



## Routes

### Create currency:
```
/currencies
```
Body:
```json
{
    "code":"D&D",
    "value": 2
}
```
### Delete currency:
```
/currencies/${code}
```
### Convert currency:
```
/conversions?from=${sourceCurrencyCode}&to=${targetCurrencyCode}&amount=${amountToConvert}
```

## Default Currencies
* USD
* BRL
* EUR
* ETH
* BTC

