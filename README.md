# Currency Converter API

A robust API for converting between different types of currencies, including fiat currencies, cryptocurrencies, and fictional currencies.

## 🌍 Features

- 💱 Conversion between multiple currencies
- 🏦 Support for fiat currencies
- 💰 Support for cryptocurrencies
- 🎲 Support for fictional currencies
- 🔄 Automatic exchange rate updates

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18+ recommended)
- Yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/tcelestino/currency-converter-api.git
cd currency-converter-api
```

2. Configure Environment
- Rename `.env.example` to `.env`
- Update configuration as needed

### Running the Application

#### Using Docker

Build the Docker image:
```bash
docker build -t currency-converter-api:latest .
```

Run the container:
```bash
docker run -p 3000:3000 currency-converter-api
```

#### Local Installation

Install dependencies and start:
```bash
yarn && yarn build && yarn start
```

#### Development Mode

```bash
# Using Docker
docker-compose up -d

# Local development
yarn && yarn dev
```

## 🌐 API Endpoints

### Currency Conversion
`GET /currency-convert/v1/convert`
- Convert values between currencies

**Parameters:**
- `from`: Source currency code (e.g., USD)
- `to`: Target currency code (e.g., BRL)
- `amount`: Value to be converted

**Example Request:**
```
GET /currency-convert/v1/convert?from=USD&to=BRL&amount=100
```

### Currency Management

#### List Currencies
`GET /currency-convert/v1/currencies`
- Retrieve all available currencies

#### Add New Currency
`POST /currency-convert/v1/currencies`
- Add a new currency to the system

**Request Body:**
```json
{
  "code": "GOLD2",
  "name": "D&D Gold Piece",
  "type": "fictional",
  "rate": 0.25
}
```

#### Remove Currency
`DELETE /currency-convert/v1/currencies/:code`
- Remove an existing currency from the system

## 📄 Documentation

Comprehensive API documentation is available at:
```
http://localhost:3000/documentation
```

## 🧪 Testing

Run test suite:
```bash
yarn test
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

MIT

## 💡 Technology Stack

- Node.js
- TypeScript
- Fastify
- Docker
- Jest

## 🚨 Disclaimer

Exchange rates are for informational purposes and may not reflect real-time market values. Always verify rates from official sources for critical transactions.
