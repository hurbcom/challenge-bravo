# Moedas Disponíveis

Lista todas as moedas cadastradas para conversão no sistema.

**URL** : `/api/currency`

**Method** : `GET`

## Sucesso

**Status Code** : `200 OK`

**Exemplo**

```json
[
    {
        "_id": "5f17e51032a8780495ae2bf6",
        "key": "eth",
        "name": "Ether",
        "unit": "ETH",
        "type": "crypto"
    },
    {
        "_id": "5f17e51632a8780495ae2bf7",
        "key": "brl",
        "name": "Brazil Real",
        "unit": "R$",
        "type": "fiat"
    },
    {
        "_id": "5f17e52432a8780495ae2bfa",
        "key": "btc",
        "name": "Bitcoin",
        "unit": "BTC",
        "type": "crypto"
    },
    {
        "_id": "5f1a5ac79e03b503d19e66e0",
        "key": "eur",
        "name": "Euro",
        "unit": "€",
        "type": "fiat"
    },
    {
        "_id": "5f1a6a2a1f86870540d99b56",
        "key": "usd",
        "name": "US Dollar",
        "unit": "$",
        "type": "fiat"
    }
]
```

## Nota

-   Caso nenhuma moeda tenha sido cadastrada será retornada uma lista vazia. Ver [Cadastar de Moedas](post-currency.md).
