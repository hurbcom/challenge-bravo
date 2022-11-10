Table of Contents
-----------------
- [Conversion controller](#conversion-controller)
- [Currency controller](#currency-controller)

Conversion controller
-----------------

<details>

<summary>GET: &nbsp &nbsp /conversion?from=FROM&to=TO&amount=0.0</summary>

Converts source amount currency to the final currency.

Parameters:
|    Name    |    Type    |    Required    |    Description    |
|    ----    |    ----    |    --------    |    -----------    |
|    from    |    string  |    true        |    Source currency to makes the conversion   |
|    to      |    string  |    true        |    Targets currency to makes the conversion   |
|    amount  |    float   |    true        |    Amount value to makes the conversion|

Responses:
|    Code    |    Description    |
|    ----    |    -----------    |
|    200     |    Success     |
|    400     |    Bad Request    |
|    500     |    Internal Server error    |

Responses examples JSON
> 200 - Success

```JSON
{
    "id": 0,
    "from": "USD", //from currency passed
    "to": "BRL", //to currency passed
    "amount": 25, // 25 dollars
    "result": 129.65146, // 25 dollars in reais
    "createdAt": "0001-01-01T00:00:00Z"
}
```

> 400 - Bad request

```JSON
// request without from parameter
{
    "Bad Request": "From parameter is required"
}

// request without to parameter
{
    "Bad Request": "To parameter is required"
}

// request without amount parameter
{
    "Bad Request": "Amount parameter is required"
}
```

> 500 - Internal server error

```JSON
{
    "Internal Server Error": "Some generic error"
}
```

</details>

Currency controller
-----------------

<details>

<summary>POST: &nbsp &nbsp /currency</summary>

Creates a new currency to conversions.

Parameters:
|    Name    |    Type    |    Required    |    Description    |
|    ----    |    ----    |    --------    |    -----------    |
|    key     |    string  |    true        |    Unique key to identify your currency   |
| description|    string  |    true        |    Some description to explain your currency   |
| exchangeApi|    bool    |    true       |     Note: if you pass a `false` value, you must informe too `customCurrency` and `customAmount` |
| customCurrency |    string  |   false    |    required when exchangeApi is `false`. A valid fiat currency to indicates value your custom currency coin. Ex: "BRL"   |
| customAmount   |    float  |    false    |    required when exchangeApi is `false`. An amount of `customCurrency` Ex: 99.0 of "BRL"   |

Responses:
|    Code    |    Description    |
|    ----    |    -----------    |
|    200     |    Success     |
|    400     |    Bad Request    |
|    500     |    Internal Server error    |

Request examples JSON

> Simple creation
```JSON
{
    "key": "YER",
    "description": "YER desc",
    "exchangeApi": true
}
```

> Custom creation
```JSON
{
    "key": "HURB",
    "description": "HURB desc",
    "exchangeApi": false,
    "customAmount": 99,
    "customCurrency": "BRL",
}
```

Responses examples JSON
> 200 - Success

```JSON
{
    "id": 0,
    "key": "YER",
    "description": "YER desc",
    "exchangeApi": true,
    "customAmount": 0,
    "customCurrency": "",
    "createdAt": "0001-01-01T00:00:00Z"
}

```

> 400 - Bad request

```JSON
// request without body
{
    "error": "EOF"
}
```

> 500 - Internal server error

```JSON
// request without key or description
{
    "error": "key and description cannot be empty"
}

// request with exchangeApi: false
{
    "error": "for custom currencies, CustomCurrency and CustomAmount cannot be empty"
}
```
</details>

<details>

<summary>GET: &nbsp &nbsp /currency</summary>

List all available currencies.

Responses:
|    Code    |    Description    |
|    ----    |    -----------    |
|    200     |    Success     |
|    500     |    Internal Server error    |


Responses examples JSON
> 200 - Success

```JSON
[
  {
      "id": 1,
      "key": "USD",
      "description": "USD description",
      "exchangeApi": true,
      "customAmount": 0,
      "customCurrency": "",
      "createdAt": "2022-11-09T20:03:04.726652Z"
  },
  {
      "id": 2,
      "key": "BRL",
      "description": "BRL description",
      "exchangeApi": true,
      "customAmount": 0,
      "customCurrency": "",
      "createdAt": "2022-11-09T20:03:04.728497Z"
  },
  // and go on...
]
```

> 500 - Internal server error

```JSON
{
    "Internal Server Error": "Some generic error"
}
```
</details>

<details>

<summary>GET: &nbsp &nbsp /currency/{id}</summary>

List currency by id

Parameters:
|    Name    |    Type    |    Required    |    Description    |
|    ----    |    ----    |    --------    |    -----------    |
|    id      |    integer |    true        |    ID of your currency   |

Responses:
|    Code    |    Description    |
|    ----    |    -----------    |
|    200     |    Success     |
|    404     |    Not found    |


Responses examples JSON
> 200 - Success

```JSON
{
    "id": 1,
    "key": "USD",
    "description": "USD description",
    "exchangeApi": true,
    "customAmount": 0,
    "customCurrency": "",
    "createdAt": "0001-01-01T00:00:00Z"
}

```

> 404 - Not found

```JSON
{
    "Not found": "Currency not found"
}
```
</details>
<details>

<summary>DELETE: &nbsp &nbsp /currency/{id}</summary>

Delete currency by id

Parameters:
|    Name    |    Type    |    Required    |    Description    |
|    ----    |    ----    |    --------    |    -----------    |
|    id      |    integer |    true        |    ID of your currency   |

Responses:
|    Code    |    Description    |
|    ----    |    -----------    |
|    200     |    Success     |
|    500     |    Internal server error    |


Responses examples JSON
> 200 - Success

```JSON
{
    "data": "Currency successfully deleted"
}

```

> 500 - Internal server error

```JSON
{
    "Internal Server Error": "Some generic error"
}
```

</details>
