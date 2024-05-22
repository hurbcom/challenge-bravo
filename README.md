# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge - Nicholas Ferrer

Build an API for currency conversion that responds with JSON. This API uses USD as a backing currency and performs conversions between various currencies with real-time values. The supported currencies include USD, BRL, EUR, BTC, and ETH, with the ability to add more as needed.


## Main Features

- Converts between different currencies (e.g., USD to BRL, USD to BTC, ETH to BRL)
- Supports FIAT, crypto, and fictitious currencies (e.g., BRL to HURB, HURB to ETH)
- Provides endpoints to add and remove supported currencies
- Real and current quotes through integration with public currency quote APIs
- Capable of handling 1000 requests per second

## Requirements

- Node.js v20
- Docker (optional for containerized deployment)

## Installation

Clone the repository:

```bash
git clone https://github.com/nicholasferrer/challenge-bravo.git
cd challenge-bravo
```

Install dependencies:

```bash
npm install
```

To start the application, run:

```bash
npm start
```

Alternatively, you can build and run the application using Docker:

```bash
docker build -t challenge-bravo .
docker run -p 3000:3000 challenge-bravo
```

The server will start on port 3000. Access the API documentation at http://localhost:3000/docs.

## Endpoints

### Convert Currency

Convert an amount from one currency to another.

- **URL:** `/convert`
- **Method:** `GET`
- **Query Parameters:**
  - `from` (string): Source currency code
  - `to` (string): Target currency code
  - `amount` (string): Amount to convert

**Example Request:**

```bash
GET /convert?from=BTC&to=EUR&amount=123.45
```

### Add Currency

Add a new currency to the supported list.

- **URL:** `/currencies`
- **Method:** `POST`
- **Body Parameters:**
  - `code` (string): Currency code
  - `type` (string): Type of currency (**FIAT, CRYPTO, FIAT**)
  - `conversionRateToUSD`  (number): Conversion rate to USD `*required with type FICTITIOUS and not considered in types FIAT and FIAT`

**Example Request:**

```bash
POST /currencies

body examples:

{
  "code": "HURB",
  "type": "FICTITIOUS",
  "conversionRateToUSD": 0.05
}

{
  "code": "SOL",
  "type": "CRYPTO"
}

{
  "code": "AED",
  "type": "FIAT"
}
```

### Remove Currency

Remove a currency from the supported list.

- **URL:** `/currencies/:code`
- **Method:** `DELETE`
- **URL Parameters:**
  - `code` (string): Currency code

**Example Request:**

```bash
DELETE /currencies/HURB
```

### Get Currency (BONUS)

Retrieve details of a specific currency.

- **URL:** `/currencies/:code`
- **Method:** `GET`
- **URL Parameters:**
  - `code` (string): Currency code

**Example Request:**

```bash
GET /currencies/BTC
```

### List Currencies (BONUS)

Retrieve a list of all supported currencies for conversion.

- **URL:** `/currencies/:code`
- **Method:** `GET`

**Example Request:**

```bash
GET /currencies
```

## Testing

### Unit Test

Run the tests using:

```bash
npm test
```

### Load Test
The API was tested under a load of 16,000 requests with the following results:

```bash
Summary report @ 10:52:48(-0300)
--------------------------------

errors.ECONNREFUSED: ........................................ 707
errors.ECONNRESET: .......................................... 2450
errors.ETIMEDOUT: ........................................... 86
http.codes.200: ............................................. 12757
http.downloaded_bytes: ...................................... 976000
http.request_rate: .......................................... 625/sec
http.requests: .............................................. 16000
http.response_time:
  min: ...................................................... 220
  max: ...................................................... 6800
  mean: ..................................................... 2100
  median: ................................................... 1950
  p95: ...................................................... 4800
  p99: ...................................................... 6300
http.responses: ............................................. 12800
vusers.completed: ........................................... 12800
vusers.created: ............................................. 16000
vusers.created_by_name.0: ................................... 16000
vusers.failed: .............................................. 3200
vusers.session_length:
  min: ...................................................... 230
  max: ...................................................... 6850
  mean: ..................................................... 2150
  median: ................................................... 1980
  p95: ...................................................... 4850
  p99: ...................................................... 6350
```

During the load test, the API also reached the maximum limit of calls to the external currency APIs to get live values. In a production environment, a different plan with these APIs should be considered to handle higher request volumes.

## ⚠️ Environment Variables ⚠️

The `.env` file was included in the repository to make testing easier for developers. It contains necessary environment variables for running the application and is meant for testing purposes only.