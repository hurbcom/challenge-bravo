<h1 align="center"> Challenge Bravo</h1>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Hub Hurb</p>

## Sobre

API para conversão monetária, com retorno em JSON. API possui uma moeda de lastro (USD) e calcula conversões entre diferentes moedas com cotações de verdade e atuais.

Originalmente, as seguintes moedas são convertidas pela API:

  * USD
  * BRL
  * EUR
  * BTC
  * ETH
  
## Documentação 

Documentação da API no formato **Swagger UI** está acessível em `https://localhost:3333/api-docs`

## Descrição

* A conversão é baseada na API externa currencylayer. 
  * NOTA: Como a API CoinAPI atualiza os valores por dia, por isso a API challenge-bravo apenas consulta a informação da CoinAPI se a requisição for feita em mais de 24h após o último pedido para uma mesma conversão [from, to]. Caso contrário, será utilizado dados de conversão de histórico. Essa abordagem visa limitar o acesso a API externa, uma vez que a cota gratuita tem limite de requisições mensais.
* A API converte moedas pré-cadastradas. Um arquivo para importação de moedas em lote é disponibilizado em currencies.csv.
* Também é possível incluir e deletar e listar moedas, conforme as rotas descritas abaixo.
*  A conversão é feita tendo como moeda de lastro a moeda USD.
* Um arquivo de testes (insomnia) também está disponível no respositório.

## Rotas

* Conversão monetária
```http
GET /exchanges?from={CURRENCY}&to={CURRENCY}&amount={AMOUNT}

Example:
http://localhost:3333/exchanges?from=SCR&to=BRL&amount=10

{
  "id": "8000379d-06e9-4eb2-829d-0e3b94f56820",
  "from": "BTC",
  "to": "BRL",
  "amount": 1,
  "value": "311608.06",
  "rate": "311608.0648951317",
  "base": "USD",
  "expires_date": 1620581411726
}

```

* Adicionar moeda
```http
POST /currencies

Example:
http://localhost:3333/currencies

{
	"symbol": "SCR"
}
```

* Importar moedas de arquivo .csv
```http
POST /currencies/import

```
![image](https://user-images.githubusercontent.com/15080423/117545323-a41dca80-affb-11eb-866f-adff3628ed5c.png)


* Listar moedas cadastradas
```http
GET /currencies

[
  {
    "id": "6dd2dd0d-0e6c-47ee-be63-ad0492440317",
    "symbol": "GBP",
    "rate": "0",
    "created_at": "2021-05-07T02:07:25.740Z",
    "last_checked": "2021-05-07T02:07:25.740Z"
  },
  {
    "id": "908691a4-716b-43aa-aa66-1cf3e39c20db",
    "symbol": "BRL",
    "rate": "0",
    "created_at": "2021-05-07T03:08:35.693Z",
    "last_checked": "2021-05-07T03:08:35.693Z"
  }
  ...
]
```

* Deletar moedas cadastradas
```http
DELETE /currencies

{
	"symbol": "BRL"
}

```

## Desenvolvimento:
O desenvolvimento foi feito usando as seguintes tecnologias:

* NodeJS (Javascript), com Typescript
* Docker 
* BD Postgres (+ TypeORM)
* BD REDIS [ utilizado para configuração do rate-limiter (o rateLimiter nao esta habilitado na api) ]
* Os testes foram feitos usando o jest. 

### Melhorias 

* Para cálculo das conversões foi utilizada uma API externa [coinapi](https://www.coinapi.io/Pricing). A escolha dessa API foi baseada na possibilidade de uso gratuito e fornecimento de informações de cryptomoedas. O retorno dessa API, no entanto, é lento em comparação a outras APIs avaliadas. Uma possibilidade de melhoria nesse cenario seria o usar o REDIS para diminuir as consultas a API externa. 
* Especificação de testes
 * NOTAS: Os arquivos de configuração foram disponibilizados as-is, com chaves temporarias, e não como .envexample para que a api possa ser rodada sem configuração local.  

## Installation

```bash
$ git clone $este-fork
cd $este-fork/backend
npm install
```

## Running the app

```bash
# docker
$ docker-compose up --force-recreate

# watch mode
$ npm run dev

# build
$ npm run build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
