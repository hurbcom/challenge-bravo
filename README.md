# Descrição

API de conversão monetária usando como lastro o valor do dolar

Nesta API é possivel realizar a conversão entre as moedas como  USD, BRL, EUR, BTC, ETH
além disso é possivel também realizar a conversão entre moedas ficticias que o usuário pode cadastrar, e a conversão entre moeda ficticia e moeda real.

# Executando o projeto

Para a execução do projeto os seguintes passos devem ser seguidos
O unico requisito exigido é ter o **docker** instalado na máquina

acesse a raiz do projeto e execute o comando:

***$ docker compose up***

# Requisições

A API fornece um conjunto de requests para interação
Além de descrever como realizar as requisições aqui,
também criei uma collection no postman para testar esse projeto,
a collection está localizada na pasta ```./docs/```, basta importar.

## ✔ Realizar conversão entre moedas

Converte valores entre moedas

### Requisição

```localhost:8000/api/convert?from=EUR&to=BRL&amount=100```

### Campos:
* from: moeda de origem
* to: moeda destino
* amount: valor a ser convertido

## ✔ Lista moedas personalizadas

Lista todas as moedas personalizadas cadastradas pelo o usuários

### Requisição

```GET localhost:8000/api/coin```

## ✔ Cria moeda personalizada

Faz o cadastro de uma moeda personalizada

### Requisição
```POST localhost:8000/api/coin```

### Body
~~~json
{
    "name": "GTA Coin",
    "code": "GTC",
    "dolarValue": 15.15
}
~~~
### Campos:
* name: o nome da Moeda a ser cadastrada
* code: o código da moeda a ser cadastrada (exemplo: CBR)
* dolarValue: valor da unidade da moeda (em dolar)

## ✔ Atualiza os dados de uma moeda existente

Realiza a modificação de um moeda existente no banco

### Request
```POST localhost:8000/api/coin/{id}```

### Body
~~~json
{
    "name": "GTA Coin",
    "code": "GTC",
    "dolarValue": 15.15
}
~~~

### Campos:
* name: o nome da Moeda a ser cadastrada
* code: o código da moeda a ser cadastrada (exemplo: CBR)
* dolarValue: valor da unidade da moeda (em dolar)

### Parametros de url
* id: id da moeda no banco de dados

## ✔ Atualiza os dados de uma moeda existente

Realiza a modificação de um moeda existente no banco

### Request
```POST localhost:8000/api/coin/{id}```

### Body
~~~json
{
    "name": "GTA Coin",
    "code": "GTC",
    "dolarValue": 15.15
}
~~~

### Campos:
* name: o nome da Moeda a ser cadastrada
* code: o código da moeda a ser cadastrada (exemplo: CBR)
* dolarValue: valor da unidade da moeda (em dolar)

### Parametros de url
* id: id da moeda no banco de dados


## ✔ Mostra dados de uma moeda cadastrada

Exibe todas as informações de uma moeda cadastrada no banco de dados

### Request
```GET localhost:8000/api/coin/{id}```

### Parametros de url
* id: id da moeda no banco de dados



## ✔ Deleta uma moeda personalizada cadastrada

Exibe todas as informações de uma moeda cadastrada no banco de dados

### Request
```DELETE localhost:8000/api/coin/{id}```

### Parametros de url
* id: id da moeda no banco de dados

# Arquivos onde eu realizei o desenvolvimento

## Migrações
* ./challenge-bravo/database/migrations/2023_02_10_175258_create_coin_table.php

## Testes

* ./challenge-bravo/tests/Feature/CurrencyConversionServiceTest.php

## Service

* ./challenge-bravo/app/Services/CurrencyConversionService.php

## Models

* ./challenge-bravo/challenge-bravo/app/Models/Coin.php

## Controllers

* ./challenge-bravo/app/Http/Controllers/CoinController.php
* ./challenge-bravo/app/Http/Controllers/CurrencyConversionController.php

## Validação de requests

* ./challenge-bravo/app/Http/Requests/CoinRequest.php
* ./challenge-bravo/app/Http/Requests/CurrencyConversionRequest.php

## Arquivos adicionais

* ./Dockerfile 
* ./docker-compose.yaml
* ./challenge-bravo/init.sql
* ./docs/challenge_brave_requests.postman_collection.json
