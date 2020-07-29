# Últimas Cotações

Retorna a taxa atual de cambio para todas as moedas cadastradas, com base na moeda de referência USD.

**URL** : `/api/currency/exchange/latest`

**Method** : `GET`

## Sucesso

**Code** : `200 OK`

**Exemplo de Conteúdo**

```json
{
    "_id": "5f1caa348f1579009c5790aa",
    "referenceDate": "2020-07-25 18:55:00",
    "eth": 0.0032874399354425043,
    "brl": 5.230550242808073,
    "btc": 0.00010323253055244165,
    "eur": 0.8579239587115299,
    "usd": 1
}
```
