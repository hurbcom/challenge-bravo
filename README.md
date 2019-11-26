# Challenge Bravo

This API has mission to solve Challenge Bravo, where make exchanges between many currencies as necessary.

---
## Development
The code was written in Python 3.7 with following frameworks:
 - flask/flask-restfull: most popular to build web applications from python;
 - jsonschema: to validate contracts of request;
 - requests: package to make http request to external services;
 
 Frameworks necessary to unit tests:
 - pytest
 - parametrized
 - munch

To make a database, in my comprehension would be a over engineering use externals services. As our data was just currencies informations, could be easily storage at memory. But if necessary, I would use the redis db.

---
## API Resources

### Currencies
**route:** /currencies
Manager the currency entity.

##### HTTP METHODS
|verbs:|GET|POST|DELETE|
|------|---|----|------|
|**description:**|List all avaiables currencies.|Insert a new currency.|Delete a avaiable currency.
|**request:**||Desireid currency on body.|Currency code on parameters.|

Examples:
```bash
curl -X GET http://localhost:5001/currencies
curl -X POST http://localhost:5001/currencies -H 'Content-Type: application/json' -d '{"code": "XRP", "name": "Ripple"}'
curl -X DELETE 'http://localhost:5001/currencies?code=XRP'
```

### Exchange
**route:** /exchange
Make currency exchange.

##### HTTP METHODS
|verbs:|GET|
|------|---|
|**description:**|Exchange the desireids currencies.|
|**request:**|Amount, base and destination currency on parameter.|

Examples:
```bash
curl -X GET 'http://localhost:5001/exchange?from=BRL&to=BTC&amount=1803.9'
```

### Healthcheck
**route:** /healtcheck
Check if all dependencies are up.

##### HTTP METHODS
|verbs:|GET|
|------|---|

Examples:
```bash
curl -X GET http://localhost:5001/healthcheck
```
More details in [Postman Collection](Bravo-challenge.postman_collection.json).

---
## How to run

```bash
bash up_application.sh
```
