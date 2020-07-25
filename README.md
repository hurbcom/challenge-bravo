# Challenge-Bravo

API Rest para conversão monetária.

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
