# API Reference

- [Conversion](#conversion)
- [Currency](#currency)

## Conversion
### Convert

```http
  GET /convert
```

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
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

Returns currency with given id.

### Post new currency
```http
POST /currency
```
Posts new currency with given body.

### Update currency
```http
PUT /currency/:id
```
| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of item to update |

Updates the currency with the given id.

### Delete currency
```http
DELETE /currency/:id
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of item to delete |

Deletes the currency with given id.
