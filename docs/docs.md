# API Reference

- [Conversion](#conversion)
- [Currency](#currency)

## Conversion
### Convert
```http
GET /convert
```
Converts the given amount.
When making the request, it updates the `exchange_rates` of the `from` String. If currency doesn't exists, but it is found in the external API, it creates the currency.

| Parameter   | Type      | Description                                 |
| :---------- | :-------- | :------------------------------------------ |
| `from`      | `string`  | **Required**. Currency name to convert from |
| `to`        | `string`  | **Required**. Currency name to convert to   |
| `amount`    | `string`  | **Required**. Amount to be converted        |


## Currency
### Get all the currencies

```http
GET /currency
```
Returns all of the currencies avaliable.

### Get currency by id
```http
GET /currency/:id
```
Returns all of the currencies by id.
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

Returns currency with given id.

### Post new currency
```http
POST /currency
```
Posts new currency with given body.
```json
{
  "name": "HUB",
  "exchange_rates": [{
    "BRL": 2.00
  }],
  "isFictional": true
}
```

### Delete currency
```http
DELETE /currency/:id
```
Deletes the currency with given id.

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of item to delete |

