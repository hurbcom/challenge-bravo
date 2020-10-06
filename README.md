# Challenge Bravo

Challenge developed using TDD with the NestJS framework and MongoDB database.

## Running the app

```bash
$ docker-compose up
# listening in http://localhost
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

<img src="http://hugo.bz/temp/cov.png" />
<br/>
<img src="http://hugo.bz/temp/wrk.png" />

<br/>

## Endpoints

### Currency exchange

```bash
GET
http://localhost/exchange/?from=USD&to=BRL&amount=1
```

<img src="http://hugo.bz/temp/get.png" />

### Create Currency

```bash
POST
http://localhost/currencies/
Put values in body:
currency=BRL
value=0.2
```

<img src="http://hugo.bz/temp/post.png" />

### Update Currency Value

```bash
PATCH
http://localhost/currencies/BRL/value
Put value in body:
value=0.22
```

<img src="http://hugo.bz/temp/update.png" />

### Delete Currency

```bash
DELETE
http://localhost/currencies/BRL
```

<img src="http://hugo.bz/temp/delete.png" />
