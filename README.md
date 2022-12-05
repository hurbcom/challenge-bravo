# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

[[English](README.md) | [Portuguese](README.pt.md)]

The API for currency conversion was developed in the Golang language and aims to capture the current quotation of the currencies and perform the conversion to the registered currencies.

 The API converts between the following currencies:

- USD
- BRL
- EUR
- BTC
- ETH
- PSN (Play station Network Virtual Currency)
- XBX (Xbox Virtual Currency)

If the user wants to register new currencies, it is possible to make an HTTP request with the body of the request in the JSON format of the example below:


{
    "code": "XBX",  
    "name": "Xbox Coins",
    "tousd": "1,50",
    "type": "FIC"
}

where:
code = currency code
name = currency name
tousd = currency to dollar conversion factor (ballast)
type = type of currency (physical (PHY) for currencies such as the dollar, Brazilian real, etc., virtual (VIR) for cryptocurrencies and fictitious (FIC) for currencies used in gaming platforms and that require conversion to buy them)

for storing coins in the database, the following structure was created using mysql

CREATE TABLE `currency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `tousd` varchar(50) NOT NULL,
  `type` varchar(3) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

to carry out the CRUD of the currency it is necessary to carry out the requests in the following ways

POST: localhost:8000/currency
PUT: localhost:8000/currency/:id
GET: localhost:8000/currency/:id
DELETE: localhost:8000/currency/:id
GET: localhost:8000/currency/

for each path we have the following Status-Code

200 - for cases of successful completion of the request
204 - for cases of successful deletion
400 - for cases of inappropriate request (non-standard values)
404 - for resource (entity) not found cases
500 - for internal errors such as database access

for the currency conversion request, you must make an HTTP request to the following path

GET localhost:8000/quotation/?from=PSN&to=BRL&amount=10

Where:
from = starting currency
to = conversion target currency
amount = conversion amount.

in this case, the user can read ?from=PSN&to=BRL&amount=10 as:
convert from currency "from" to currency "to" the value of "amount"

As an example, we have the case of the following HTTP request

GET localhost:8000/quotation/?from=PSN&to=BRL&amount=10

as a result, we will have the following response in JSON format:

{
    "code": "Play Station Coins",
    "codein": "Brazilian-Real",
    "name": "Play Station Coins/Brazilian-Real",
    "bid": "65.685759",
    "create_date": "2022-12-05 13:12:19"
}

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
