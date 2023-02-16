# Desafio Bravo - API de Cotações de Moedas

Este projeto é uma API de cotações de moedas desenvolvida para atender ao desafio da empresa Hurb. A aplicação fornece informações atualizadas sobre as taxas de câmbio entre diversas moedas e suporta um grande volume de requisições por segundo.

## Tecnologias Utilizadas

A API foi desenvolvida utilizando as seguintes tecnologias:

-   [FastAPI](https://fastapi.tiangolo.com/) - um framework web assíncrono para Python.
-   [SQLAlchemy](https://www.sqlalchemy.org/) - uma biblioteca de mapeamento objeto-relacional para Python.
-   [pytest](https://docs.pytest.org/en/latest/) - uma estrutura de teste para Python.
-   [PostgreSQL](https://www.postgresql.org/) - um sistema gerenciador de banco de dados relacional.
-   [Locust](https://locust.io/) - uma ferramenta para testes de carga e estresse.

## Instalação

Para executar a aplicação em sua máquina local, siga os passos abaixo:

1.  Faça o clone do repositório:

bashCopy code

`git clone https://github.com/willianweiss/challenge-bravo`

## Como rodar a aplicação

Para executar a aplicação, primeiro renomeie o arquivo `.env.example` para `.env`. Em seguida, execute o seguinte comando:

bashCopy code

`docker-compose up --build` 

A aplicação também pode ser executada utilizando os seguintes comandos e auxiliares:

Comando

Descrição

`make build`

Builda a aplicação e aplica migrations alembic

`make down`

Derruba a aplicação (api, banco de dados e coinbase_feeder)

`make up`

Inicia a aplicação (api, banco de dados e coinbase_feeder)

`make test-cov`

Executa testes unitários com cobertura de código

`make lint`

Aplica linters black e isort para formatação do código

`make stress_tests`

Executa testes de carga com locust

## Endpoints

A documentação extensa de todo tipo de input e output pode ser encontrada em [http://localhost:8000/docs](http://localhost:8000/docs) conforme indicação de como executar a aplicação.

Endpoint

Método

Retorno

`/currency`

GET

Retorna todas as moedas cadastradas

`/currency/{currency_code}`

GET

Retorna a cotação de uma moeda específica

`/currency`

POST

Cria uma moeda fictícia

`/currency/{currency_code}`

PUT

Atualiza a cotação de uma moeda específica

`/currency/{currency_code}`

DELETE

Deleta uma moeda específica

`/convert`

GET

Converte o valor de uma moeda para outra

![stress tests results](https://chat.openai.com/app/docs_images/endpoints.png)

## Testes

Foram criados testes unitários cobrindo todos endpoints da aplicação, convert/currency.

Para executá-los, utilize o seguinte comando:

bashCopy code

`make test-cov` 

O resultado do teste de cobertura será apresentado no terminal, assim como um relatório em formato xml, que pode ser encontrado no diretório `app`.

## Banco de Dados

O banco de dados é criado automaticamente quando a aplicação é iniciada e possui duas tabelas:

-   `coinbase_currencies_public_api`: moedas e cotações da API Coinbase que podem ser acessadas no endpoint `'/currency'` [GET]
-   `fictitious_currencies`: moedas e cotações das moedas fictícias criadas pelo usuário no ednpoint `'/currency'` [POST]