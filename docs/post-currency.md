# Cadastro de Moedas

Cadastra moedas no sistema de conversão.

**URL** : `/api/currency`

**Method** : `POST`

**Restriçoes de Dado**

Forneça a chave da moeda a ser cadastrada

```json
{
    "key": "[ 3 caracteres unicode ]"
}
```

**Exemplo de dado** All fields must be sent.

```json
{
    "key": "USD"
}
```

## Sucesso

**Code** : `201 CREATED`

**Exemplo de Conteúdo**

```json
{
    "key": "usd",
    "name": "US Dollar",
    "unit": "$",
    "type": "fiat",
    "_id": "5f1a762551f4a8063abcc4b3"
}
```

## Erro

**Condição** : Se a moeda não é suportada pela api ( ver [moedas disponíveis](available-currency.md) ).

**Code** : `400 BAD REQUEST`

**Conteúdo** :

```json
{ "key": "EXP" }
```

**Resposta** :

```json
{
    "status": 400,
    "message": "No support for given currency key: exp",
    "date": "2020-07-24 02:51:09"
}
```

### Or

**Condição** : Se a moeda ja foi cadastrada anteriormente

**Code** : `400 BAD REQUEST`

**Resposta**

```json
{
    "status": 400,
    "message": "Key usd is already available",
    "date": "2020-07-24 02:54:37"
}
```
