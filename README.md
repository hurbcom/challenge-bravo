# Challenge-Bravo

  API que realiza conversão de valores entre moedas ou criptomoedas

## Requirements



- Node (^v14.15.1)

- MongoDB

- Docker

-  [Coinbase](https://developers.coinbase.com/api/v2)



## Setup

`docker-compose build && docker-compose up`

## Environment

- `PORT`: Porta utilizada pela API (8080)

- `MONGO_PORT`: Porta utilizada pelo DB (27017)

- `MONGO_HOST`: Nome do host do DB

- `MONGO_CURRENCY_COLLECTION`: Nome da coleção no DB (currency)

- `API_KEY`: Chave utilizada pela Coinbase API

- `API_SECRET`: Secret utilizado pela Coinbase API

- `UPDATE_RATE_JOBS_CRON`: Configuração do job que atualiza a cotação das moedas, a cada 2 minutos . ("*/2 * * * *")

## Endpoints

### Cadastrar moeda

URL: `addCurrency?currency={moeda}`

Method: `POST`

#### Validações

- currency:
--	Deve possuir 3 caracteres e estar em uppercase.
--	Deve ser suportada pela Coinbase API.
--	Não deve estar cadastrada.

#### Exemplo de requisição
Requisição: `http://localhost:8080/addCurrency?currency=JPY`

``{
"result":  "Currency JPY successfully registered."
}``


### Remover moeda

URL: `removeCurrency?currency={moeda}`

Method: `DELETE`

#### Validações

- currency:
--	Deve possuir 3 caracteres e estar em uppercase.
--	Deve estar cadastrada.

#### Exemplo de requisição
Requisição: `http://localhost:8080/removeCurrency?currency=JPY`

``{
"result":  "Currency JPY successfully deleted."
}``


### Converter moedas

URL: `convertCurrency?from={moeda}&to={moeda}&amount={valor}`

Method: `GET`

#### Validações

- from:
--	Deve possuir 3 caracteres e estar em uppercase.
--	Deve estar cadastrada.

- to:
--	Deve possuir 3 caracteres e estar em uppercase.
--	Deve estar cadastrada

- amount:
--	Não deve ser negativo.
--	Deve ser utilizado `.` como separador decimal.

#### Exemplo de requisição
Requisição: `http://localhost:8080/convertCurrency?from=USD&to=BRL&amount=10`

``{
"result":  "54.5005"
}``

## Jobs

### Update Rates
Job que atualiza a cotação das moedas a cada 2 minutos.

Para executar separadamente utilizar o comando:
`npm run start-job`

## Testes

Para executar os testes utilizar o comando:
`npm run test`

## Aquitetura

- A estrutura de pastas utilizada foi baseada nos projetos MVC que eu participei e tinha mais familiaridade.
- A escolha da API para consulta das moedas foi baseada em ser umas das mais conhecidas e com um grande número de moedas suportadas além de ter uma biblioteca disponível para o desenvolvimento.
- Para testes foi utilizado o Jest para fazer os cenários e o Mongo Memory Server para ser utilizado como banco em memória para testar a integração com a base de dados.

## TO-DO
- Adicionar endpoint de healthcheck.
- Adicionar endpoint de listagem de moedas suportadas.