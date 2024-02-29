#### Documentação resumida

> [!NOTE]
> Para uma experiência mais completa acesse o endereço:<br>
> http://localhost:3000/api-docs/


##### Solicitar uma conversão entre duas moedas

```shell
curl --request GET \
  --url 'http://localhost:3000/?from=BRL&to=USD&amount=1'
```
Parâmetros:
| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| from | query | Moeda de origem | Yes | string |
| to | query | Moeda de destino | Yes | string |
| amount | query | Valor a ser convertido | Yes | number |

Response:
| Code | Description |
| ---- | ----------- |
| 200 | Ok |
| 400 | Bad Request |
| 404 | Not found |
| 500 | Internal Server Error |

##### Criar uma nova moeda

```shell
curl --request POST \
  --url http://localhost:3000/ \
  --header 'Content-Type: application/json' \
  --data '{
	"currency": "GTA",
	"ballast_usd": 0.000013544,
	"crypto": false
}'
```
Body:
| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| currency | body | Nome da moeda | Yes | string |
| ballast_usd | body | Valor da moeds em Dólar Americano (USD) | Yes | number |
| crypto | body | Se é uma criptomoeda | Yes | boolean |

Response:
| Code | Description |
| ---- | ----------- |
| 201 | Created |
| 400 | Bad Request |
| 409 | Conflict |
| 500 | Internal Server Error |

##### Remover uma moeda 

*Só poderão ser removidas as moedas criadas pelo usuário.
**As moedas obtidas pelo [worker](#worker-1) não poderão ser removidas

```shell
curl --request DELETE \
  --url 'http://localhost:3000/?currency=GTA'
```
Parâmetros:
| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| currency | query | Moeda a ser removida | Yes | string (string) |

Response:
| Code | Description |
| ---- | ----------- |
| 200 | Ok |
| 400 | Bad Request |
| 403 | Forbidden |
| 404 | Not found |
| 500 | Internal Server Error |