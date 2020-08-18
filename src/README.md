# Challenge Bravo - Hurb

Challenge created by Hurb to develop an API to convert, create, delete, and convert currencies coins. Well, Hurb, challenge accepted!

## How to run the application:
To run the aplication you simply have to run `docker-compose up`


Ps: If the available currencies (BRL, EUR, BTC, ETH, USD) doesn't store in the batabse automatically when running the docker command, you just have to use the Add Currency endpoint to create those currency in the database. To see how the endpoints work simply follow the instructions bellow.


## Add currency

**Description:** Endpoint developed to allow API users to create new currency coins to the list of coins available to be converted.


**Rules:** `code` is a mandatory field and should contain only three letters, meanwhile `name` is a optional field and should have the name of the currency coin added. You cannot add a currency that alreday exists in the database.

### Contract

**METHOD / CONTEXT**

##### `POST`  /currencies

**REQUEST BODY**

    code: { type: string, required: true },
    name: { type: string, required: false },

Example:
```json
{
  "code": "TSZ",
  "name": "Tanzania shilling",
}
```

**RESPONSES**

| Status Code | Description | Response |
|--|--|--|
| 200 | Currency added | ```{message: "New currency coin created successfully!", "currency": {"code": "BTC", "name": "Bitcoin", "id": "11c68d48-f16f-4ce4-b858-dbb4402a39bb"}}``` |
| 400 | Validation error | ```{message: "Invalid entries. Make sure the code you entering is 3 letter long and does not exist in the list of available currencies"}```  |
| 500 | Internal Server error| Unexpected error |


## List currency

**Description:** Endpoint developed to allow API users to list the available currencies to be converted.


### Contract

**METHOD / CONTEXT**

##### `GET`  /currencies


**RESPONSES**

| Status Code | Description | Response |
|--|--|--|
| 200 | Currencies listed | ```[{"id": "e56f762e-0d84-4a16-9586-a9f1dd53fdb8", "code": "TZS", "name":"Tanzania shilling"}, {"id": "e5634362e-034284-2rer6-9er6-e9ffddfer53fdb8", "code": "CAD", "name": "Canadian dollar"}]``` |
| 400 | Validation error | ```{message: "Invalid entries"}```  |
| 500 | Internal Server error| Unexpected error |

## Delete Currency

**Description:** In order to allow API users to delete available currencies coins on the list, we must create a endpoint to delete currency.

**Rules:** The API user must send a valid `id` in the params in order to delete a currency coin

### Contract

**METHOD / CONTEXT**

##### `DELETE`  /currencies/:id

**REQUEST PARAMS**

id: { type: string, required: true }

**RESPONSES**

| Status Code | Description | Response |
|--|--|--|
| 204 | Currency coin deleted |  |
| 400 | Validation error | ```{message: "Invalid entries"}```  |
| 500 | Internal Server error| Unexpected error |

## Convert currencies

**Description:** In order to allow API users to convert currencies coins, we must create an endpoint to convert coins

**Rules:** `from` is a mandatory field and should contain only three letters, `to` is also a mandatory field and should contain only three letters, and `ammount` is a mandatory field and must contain a number.
Users can only convert coins that are available on the list of currencies.
### Contract

**METHOD / CONTEXT**

##### `POST`  /currencies/convert


**REQUEST BODY**

    from: { type: string, required: true },
    to: { type: string, required: true },
    ammount: { type: number, required: true }

**Example**:
```json
{
    "from": "BRL",
    "to": "USD",
    "amount": "1200",
}
```

**RESPONSES**

| Status Code | Description | Response |
|--|--|--|
| 200 | Currencies converted | ```{"message":"Currency converted successfully", "covert":226.71}, }``` |
| 400 | Validation error | ```{message: "Invalid entries"}```  |
| 500 | Internal Server error| Unexpected error |

## Contact
Feel free to reach out to me if you need any help (:
Yours truly,

**Lucas Scherpel |
lucasscherpel@gmail.com**
