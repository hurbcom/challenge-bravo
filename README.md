## [Challange Bravo - HURB](https://github.com/hurbcom/challenge-bravo)


### Used in project:
- Flask (Framework) [github repo](https://github.com/pallets/flask)
- Flask-SQLALchemy (Framework) [github repo](https://github.com/pallets/flask-sqlalchemy)
- Requests (Library) [github repo](https://github.com/psf/requests)
- os (Library) [Python official Library](https://docs.python.org/3/library/os.html)
- Unittest (library) [Python official Library](https://docs.python.org/3/library/unittest.html)
- Locust (Framework) [oficial website](https://locust.io/)
- Logging (Framework) [Python official Library](https://docs.python.org/3/library/logging.html)
- Pytest (Framework) [official website](https://pytest.org/)


### Databased used in project:
- SQLite: As its a local API to testing only, was used the SQLite3, if it goes to production, its necessary change
in `config.py`. The recommendation is use postgreSQL in production. The Flask will create a database called
`hurbchallange.sqlite3`


### Tests
`unittest-test-passed.png`


### Perfomance
The API supported about 200 users per second This is because the database is not asyncronous,
so it is only making one request at a time. Flask-SQLAlchemy does not handle information with asyncronity as well.
If the API was for production, just add PostgreSQL with psycopg2. The flask 2.x support multithreading requests (about 1500 user per secound).
The test was perfomaced using the `locust`.
To use the `locust`, run the command in root project folder
`locust -f currency_exchange/tests/perfomance/api_convert.py`
Test perfomaced: `locust-perfomaced-test.png`


### Docker
I configured the docker but I didn't use it for it, because I was losing the API perfomance through the docker.
I configured the docker but I didn't use it for it, because I was losing the API perfomance through the docker.
Messages were taking longer to respond and with concurrent users it was failing with few users


### About API
This API is for converting between two available currencies released by us.
With this API, you can convert, add and remove currencies.


### How to usage
1. clone the repository
2. Access the project folder
3. FLASK_APP=app.py flask run --host=0.0.0.0 --port=8080 ( or you can run the app.py in your IDE )
4. Access the [webpage](http://0.0.0.0:8080/currencies) and verify its working.


### Usage
**Currencies Exchanger**, if user don't informing the parameter "amount", it by default will assuming with 1
```http
GET /convert?from=BRL&to=USD&amount=1
```

**Get the all available currencies**, will display all currencies available (*real and fictional*)
```http
GET /currencies
```

**Insert a new currency**, the rate is worth **1 USD** of the new currency.
This calculation is necessary as all currencies are dollar based, although it is possible to do
for any available currency.
```http
POST /currencies
```
*parameter necessary to insert, symbol and rate. The symbol should be a STR and the rate should be a float or int*
```json
{
    "symbol": "XYZ",
    "rate": 1
}
```

**Delete a currency**, by default, no currencies are deleted from the database, they are just "disabled",
ie to keep a history. Although the currency is in the database, if it is turned off, you cannot do any queries on it.
```http
DELETE /currencies
```
*parameter necessary to insert*
```json
{
    "symbol": "XYZ",
}
```

**Enable/Unable a currency**, you can enable or disable all kind of currency. You must informing in parameters
the symbol and available
```http
POST /currencies
```
*parameter necessary to enable/disable*
```json
{
    "symbol": "XYZ",
    "available": false,
}
```


