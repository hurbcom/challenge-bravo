# Challenge Bravo

Aplicação desenfolvida para teste técnico da vaga de TI | Desenvolvedor(a) Full Stack da Hurb

## Objetivo

A aplicação consiste em uma api para conversão monetária através de requisições simples.
Por exemplo: Quanto seria 5 dólares em reais? ou Quanto está a cotação do Bitcoin em reais hoje?

## Modedas Disponíveis

| SIgla |      Nome       |
| :---: | :-------------: |
|  USD  | Dólar Americano |
|  BRL  | Real Brasileiro |
|  EUR  |      Euro       |
|  BTC  |     Bitcoin     |
|  ETH  |    Ethereum     |

---

## Rotas

### `GET /api` - Rota para conversão de moedas

| Parâmetro |          Descrição          | Formato  |
| :-------: | :-------------------------: | :------: |
|   from    |        Moeda origem         |          |
|    to     |        Moeda destino        |          |
|  amount   | Quantidade a ser convertida | Numérico |

#### Exemplos:

`GET /api?from=BTC&to=BRL&amount=1`

Resposta:

`Status Code - 200`

```json
{
    "BTC": 1.0,
    "BRL": 124608.0,
    "quote_date": "2022-07-21 13:01:07"
}
```

Caso os parâmetros from e to sejam iguais:

```json
{
    "message": "Nothing to convert."
}
```

#### Possíveis erros:

---

`400` - Parâmetros não informados

`GET /api`

```json
{
    "error": "Validation error.",
    "from": ["Missing param"],
    "to": ["Missing param"],
    "amount": ["Missing param"]
}
```

---

`400` - Parâmetro com formato inválido

`GET /api?from=USD&to=BRL&amount=abc`

```json
{
    "error": "Validation error.",
    "amount": ["Not a valid number."]
}
```

---

`404` - Moeda não registrada

`GET /api?from=USD&to=PKM&amount=1`

```json
{
    "error": "Currency PKM not registered.",
    "currencies": ["USD", "BRL", "EUR", "BTC", "ETH"]
}
```

---

### `POST /api` - Rota para registro de moedas

Todos os campos são obrigatórios. O campo de `conversion` servirá para que seja estabelecido uma relação entre a nova moeda criada e o dólar americano (USD)

|   Campo    |              Descrição               |
| :--------: | :----------------------------------: |
|    code    |            Sigla da moeda            |
|   label    |      Descrição do nome da moeda      |
| is_crypto  |     Indica se é uma criptomoeda      |
| conversion | Informações para a conversão inicial |

-   Conversion

    | Campo |                             descrição                             |
    | :---: | :---------------------------------------------------------------: |
    |  USD  |             Um número representando um valor em dólar             |
    | local | Valor da moeda criada que corresponde ao valor informado em dólar |

#### Exemplos:

`POST /api`

```json
{
    "code": "jpy",
    "label": "Iene",
    "is_crypto": false,
    "conversion": {
        "USD": 1,
        "local": 136.62
    }
}
```

Resposta:

`Status Code - 200`

```json
{
    "id": "da8d8df8-ff6e-4640-b43b-693df8114cca",
    "code": "JPY",
    "label": "Iene",
    "backing_currency": false,
    "is_crypto": false,
    "created_at": "Tue, 26 Jul 2022 14:31:34 GMT",
    "updated_at": "Tue, 26 Jul 2022 14:31:34 GMT"
}
```

O campo `backing_currency` é um campo de controle.

#### Possíveis erros:

---

`400` - Campos obrigatórios não informados

`GET /api`

```json
{
    "error": "Validation error.",
    "conversion": ["Missing data for required field."],
    "label": ["Missing data for required field."],
    "code": ["Missing data for required field."]
}
```

---

`400` - Campos aninhados obrigatórios não informados

`GET /api`

```json
{
    "error": "Validation error.",
    "conversion": {
        "local": ["Missing data for required field."],
        "USD": ["Missing data for required field."]
    }
}
```

---

`409` - Código jpa cadastrado

`GET /api`

```json
{
    "error": "Unique violation error.",
    "code": ["This field is already registered."],
    "label": ["This field is already registered."]
}
```

---
