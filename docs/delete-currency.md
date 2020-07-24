# Remover Moedas

Remove moedas cadastradas para conversão no sistema.

**URL** : `/api/currency/:key/`

**Parâmetros da URL** : `key=[3 caracteres unicode]` onde `key` é a chave da moeda a ser removida do sitema.

**Method** : `DELETE`

**Data** : `{}`

## Sucesso

**Condição** : Se a chave esta cadastrada.

**Code** : `204 NO CONTENT`

**Conteúdo** : `{}`

## Erro

**Condição** : Se não houver chave cadastrada.

**Code** : `404 NOT FOUND`

**Conteúdo** :

```json
{
    "status": 404,
    "message": "No currency found with given key: exp",
    "date": "2020-07-24 03:18:26"
}
```
