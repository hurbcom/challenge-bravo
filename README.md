# Challenge-Bravo

API Rest para conversão monetária.

## Pré-Requisitos

-   Docker v19.03.1^

## Setup

`docker-compose build && docker-compose up`

## Endpoints

Todos os endpoints fornecidos por essa aplicação não exigem autenticação.

### Moedas

Endpoints que gerenciam as moedas que serão utilizadas para conversão pela API (ver [moedas disponíveis](docs/available-currency.md)).

-   [Moedas Disponíveis](docs/list-currency.md) : `GET /api/currency`

-   [Cadastrar Moeda](docs/post-currency.md) : `POST /api/currency`

-   [Remover Moeda](docs/delete-currency.md) : `DELETE /api/currency/:key`

### Conversão

Endpoints relacionados à conversão entre moedas cadastradas no sistema.

-   [Última Cotação](docs/latest-exchange-rates.md) : `GET /api/currency/exchange/latest`
-   [Converter Moedas](docs/exchange.md) : `GET /api/currency/exchange?from=:key1&to=:key2&amount=:value`

## Testes

### Unitario

    npm run unit-test ( Jest )

### Integração

    npm run integration-test ( Postman Collection com Newman )

-   Exemplo

```bash
	> node ./tests/integration/integration.js

	newman

	Challenge-Bravo-Collection

	❏ Crud Moeda
	↳ Cadastrar Moeda ETH
	POST localhost:3000/api/currency [201 Created, 339B, 1379ms]
	✓  Cadastro da chave ETH

	↳ Moeda ETH Disponível
	GET localhost:3000/api/currency [200 OK, 523B, 8ms]
	✓  Chave ETH disponível

	↳ Remoção da Chave ETH
	DELETE localhost:3000/api/currency/ETH [204 No Content, 143B, 597ms]
	✓  Sucesso na deleção

	→ Cadastrar Moeda BRL
	POST localhost:3000/api/currency [400 Bad Request, 337B, 2.5s]
	✓  Cadastrada chave BRL
	GET localhost:3000/api/currency [200 OK, 431B, 8ms]

	→ Cadastrar Moeda USD
	POST localhost:3000/api/currency [400 Bad Request, 337B, 553ms]
	✓  Cadastrada chave USD
	GET localhost:3000/api/currency [200 OK, 431B, 5ms]

	→ Moedas Disponíveis
	GET localhost:3000/api/currency [200 OK, 431B, 5ms]
	✓  Chave USD disponível
	✓  Chave BRL disponível

	→ Ultima Cotação
	GET localhost:3000/api/currency/exchange/latest [200 OK, 349B, 5ms]
	✓  Status code 200
	✓  Existe cotação  da chave USD
	✓  Existe cotação  da chave BRL

	→ Conversão de Moedas
	GET localhost:3000/api/currency/exchange?from=USD&to=BRL&amount=1000.0 [200 OK, 349B, 5ms]
	✓  Status code 200

	┌─────────────────────────┬───────────────────┬───────────────────┐
	│                         │          executed │            failed │
	├─────────────────────────┼───────────────────┼───────────────────┤
	│              iterations │                 1 │                 0 │
	├─────────────────────────┼───────────────────┼───────────────────┤
	│                requests │                10 │                 0 │
	├─────────────────────────┼───────────────────┼───────────────────┤
	│            test-scripts │                19 │                 0 │
	├─────────────────────────┼───────────────────┼───────────────────┤
	│      prerequest-scripts │                11 │                 0 │
	├─────────────────────────┼───────────────────┼───────────────────┤
	│              assertions │                11 │                 0 │
	├─────────────────────────┴───────────────────┴───────────────────┤
	│ total run duration: 5.5s                                        │
	├─────────────────────────────────────────────────────────────────┤
	│ total data received: 1.27KB (approx)                            │
	├─────────────────────────────────────────────────────────────────┤
	│ average response time: 515ms [min: 5ms, max: 2.5s, s.d.: 812ms] │
	└─────────────────────────────────────────────────────────────────┘
```

### Carga

    `npm run load-test` (Artillery)
