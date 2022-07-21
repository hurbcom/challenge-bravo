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

## Rotas

### `GET /api`

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
