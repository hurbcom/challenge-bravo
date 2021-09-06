# Challenge-Bravo

  API que realiza conversão de valores entre moedas ou criptomoedas

## Requirements



- Python3+

- Docker



## Setup

- 'docker build -t challengebravo:latest .'
- 'docker run -p 5000:5000 challengebravo'

## Endpoints

### Cadastrar moeda

URL: `exchangePrice/createCurrency?symbol={moeda}&usd_value={valor}&keep_updated={booleano}`

Method: `PUT`

#### Validações

- symbol:
--  Representa o símbolo da moeda
--  Não deve estar cadastrada.

- usd_value:
--  Precisa ser um valor numérico

- keep_updated:
--  Funcional apenas para moedas existentes na Coinbase
--  Campo opcional

#### Exemplo de requisição
Requisição: `http://localhost:5000/exchangePrice/createCurrency`

``{
    "symbol": "ADA",
    "usd_value": "0.34131440176118233",
    "keep_updated": true
}``


#### Retorno
``{
    "error": null,
    "message": "Currency successfully created"
}``


### Remover moeda

URL: `exchangePrice/deleteCurrency`

Method: `DELETE`

#### Validações

- currency:
--	Deve possuir 3 caracteres e estar em uppercase.
--	Deve estar cadastrada.

#### Exemplo de requisição
Requisição: `http://localhost:5000/exchangePrice/deleteCurrency`

``{
    "symbol": "ADA"
}``

#### Retorno

``{
    "error": null,
    "message": "Currency successfully deleted"
}``


### Converter moedas

URL: `exchangePrice/convertCurrency?from={moeda}&to={moeda}&amount={valor}`

Method: `GET`

#### Validações

- from:
--	Deve estar cadastrada.

- to:
--	Deve estar cadastrada

- amount:
--	Deve ser um valor numérico utilizando '.' como separador decimal.

#### Exemplo de requisição
Requisição: `http://localhost:5000/exchangePrice/convertCurrency?from=BTC&to=EUR&amount=5`

#### Retorno

``{
  "convertedValue": "0.00011562"
}``

## Jobs

### Currency Updater
Job que atualiza a cotação das moedas a cada 30 segundos.
O job roda através de um schedule inicializado junto a API na própria aplicação.

## Execução local e Testes

Para executar a aplicação localmente utilize os comandos:
- `venv\Scripts\activate`
- `set FLASK_APP=challengebravo`
- `set FLASK_ENV=development`
- `flask init-db`
- `flask run`



Para executar os testes utilizar o comando:
`pytest`

## Aquitetura

- Foi utilizado o flask em conjunto ao SQLite devido a familiaridade e da praticidade tanto de criação de APIs com o uso do flask quanto a de configuração do banco com o SQLite.
- A Coinbase foi utilizada para consultar os valores das moedas pelo grande número de moedas suportadas, assim como a sua popularidade em busca de cotações.
- Para testes foi utilizado o Pytest, sendo possível testar desde a inicialização da aplicação, as APIs e a integração com o banco de dados de maneira prática.

## TO-DO
- Adicionar endpoint de listagem de moedas suportadas pela atualização automática baseada na cotação da coinbase.