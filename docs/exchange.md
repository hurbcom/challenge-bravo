# Conversão de Moedas

Retorna a conversão das moedas fornecidas de acordo com a ultima cotação, conforme disponibilidade.

**URL** : `/api/currency/exchange?from=:from&to=:to&amount=:amount`

**Method** : `GET`

**Query Parameters** :

-   `from=[ 3 caracteres unicode ]` onde `from` é a chave da moeda de origem a ter o valor convertido.
-   `to=[ 3 caracteres unicode ]` onde `to` é a chave da moeda de destino.
-   `amount=[ numero com . como separador decimal e sem separador de milhar]` onde `amount` é a quantidade da moeda origem a ser convertida.

## Sucesso

**Condição** : Se ambas chaves de moeda estão cadastradas e a quantidade é valida.

**Code** : `200 OK`

**Exemplo de Conteúdo**

**_URL_** : GET `/api/currency/exchange?from=USD&to=BRL&amount=1230.50`

```json
{
    "value": 6436.192029166489,
    "from": "usd",
    "to": "brl",
    "amount": 1230.5,
    "referenceDate": "2020-07-25 18:24:00"
}
```

-   referenceDate é a data em que foi solicitada a conversão.

## Erro

**Condição** : Se alguma das chaves requeridas não estiverem cadastradas.

**Code** : `404 BAD REQUEST`

**_URL_** : GET `api/currency/exchange?from=USD&to=EXP&amount=10.50`

**Conteúdo** :

```json
{
    "status": 400,
    "message": "No support provided to given currency: exp",
    "date": "2020-07-25 18:51:34"
}
```

**Condição** : Se alguma das chaves requeridas não estiverem cadastradas.

**Code** : `404 BAD REQUEST`

**_URL_** : GET `api/currency/exchange?from=USD&to=BRL&amount=test`

**Conteúdo** :

```json
{
    "status": 400,
    "message": "No valid amount value in query parameter.",
    "date": "2020-07-25 18:53:32"
}
```
