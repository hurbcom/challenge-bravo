# challenge bravo

> Desafio Leandro Greijal

## Run

OS X & Linux:

```sh
make run
```

## Usage example

### Exchange

```sh
GET /exchange?from=BRL&amount=1 HTTP/1.1
Host: localhost:8081
```

### GET currency

```sh
GET /currency/BRL HTTP/1.1
Host: localhost:8081
```

### Create currency

```sh
POST /currency HTTP/1.1
Host: localhost:8081
Content-Type: application/json

{
    "code":"BRL",
    "rate": 0.3
}
```

### Update currency

```sh
PUT /currency/BRL HTTP/1.1
Host: localhost:8081
Content-Type: application/json

{
    "rate": 0.5
}
```

### Delete currency

```sh
DELETE /currency/BRL HTTP/1.1
Host: localhost:8081
```