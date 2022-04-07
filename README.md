# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com **cotações de verdade e atuais**.
[Mais detalhes](README.desafio.pt.md)

# Solução com PHP

A solução foi desenvolvida em Lumen com Sqlite, Redis e integrado ao ([AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas)).
E se propõe a converter moedas reais ou fictícias, lastreadas ao USD. Para as moedas fictícias existem rotas para
criar, excluir e atualizar a cotação, além de uma rota para conversão aleatória para utilização em testes no Jmeter.

Abaixo todas tecnologias utilizadas:
- **Lumen 8** para API REST aberta, leve e rápida;
- **SQLite** para persistir moedas fictícias;
- **Redis** para diminuir os acessos à API externa de cotações, ganhando mais performance;
- **GuzzleHttp** para integração com API externa;
- **PHPUnit/php-code-coverage** Para testes unitários;
- **PHP Code Coverage** Para análise de cobertura de testes;
- **JMeter** Para análise de teste de estresse;
- **Docker** Para virtualização baseada na imagem php:7.4-fpm-alpine;
- **Postman** Para criação de [collections](https://www.getpostman.com/collections/0f39232dc32529cee1d4) e [documentação básica](https://documenter.getpostman.com/view/16002453/UVyxNsqL);

## Limitação

A ([AwesomeAPI](https://docs.awesomeapi.com.br/api-de-moedas)) é uma API pública e sem a necessidade de gerar token de autenticação.
Além disto, ela possui uma falha na formatação de preço de algumas moedas. 
Para esta solução, foram tratados somente os erros relacionados ao BTC e ETH.
E apesar destes pontos acima, esta API foi escolhida por se tratar de uma API gratuita e simples.

[Para mais detalhes sobre o erro citado.](https://github.com/raniellyferreira/economy-api/issues/23)


## Executando o projeto

É necessário instalar **docker** e **docker-compose**, caso ainda não estejam.

Clonar o repositório
- `git clone git@github.com:wilkersouza/challenge-bravo.git`

Entrar na pasta
- `cd challenge-bravo`

Rodar o container
- `docker-compose up --build -d`

Acessar
- http://localhost:8000

Se exibir a versão do Lumen, a aplicação está pronta.

## Executando Testes

Este comando irá executar os testes unitários e gerar relatório de cobertura,
que estará disponível na pasta **tests/coverage-html**:
- `docker exec -it challenge-bravo_lumen_1 php -dxdebug.mode=coverage vendor/bin/phpunit --testdox --coverage-html tests/coverage-html`

Caso o nome do container não seja **challenge-bravo_lumen_1**, liste os containers para pegar o nome correto:
- `docker ps`

#### Teste de estresse

Os relatórios dos testes estão em **tests/jmeter**.

## Documentação e Collections

Via POSTMAN 
 - [Collections](https://www.getpostman.com/collections/0f39232dc32529cee1d4);
 - [Documentação](https://documenter.getpostman.com/view/16002453/UVyxNsqL);

## Rotas

#### Criando Moeda
```
Endpoint: /api/v1/currencies
Method: POST
Body: {
    "code": "TST",
    "price": 1245.33
}
Response Success: {
    status: 201,
    body: {
        "code": "TST",
        "price": "1245.33",
        "id": 7
    }
}

Response Error: {
    status: 422,
    body: {
        "error": "<MESSAGE>"
    }
}

```

#### Atualizando Preço
```
Endpoint: /api/v1/currency/{ID}
Method: PATCH
Body: {
    "price": 999.99
}
Response Success: {
    status: 200,
    body: {
        "id": ID,
        "code": "TST",
        "price": "999.99"
    }
}

Response Error: {
    status: 422,
    body: {
        "error": "<MESSAGE>"
    }
}
```

#### Deletando Moedas
```
Endpoint: /api/v1/currency/{ID}
Method: DELETE
Body: {}
Response Success: {
    status: 204,
    body: {}
}

Response Error: {
    status: 422,
    body: {
        "error": "<MESSAGE>"
    }
}
```

#### Convertendo Moeda
```
Endpoint: /api/v1/convert-currency/?to={CODE_TO}&from={CODE_FROM}&amount={FLOAT}
Method: GET
Body: {}
Response Success: {
    status: 200,
    body: {
        "backingCurrency": "USD",
        "codeTo": "BRL",
        "CodeFrom": "USD",
        "priceTo": "0.2109",
        "priceFrom": 1,
        "exchangeRate": 0.2109,
        "amount": 500.5,
        "convertedAmount": 105.55545000000001,
        "priceToDate": "2022-04-07 15:00:01",
        "priceFromDate": "2022-04-07 15:00:01"
    }
}

Response Error: {
    status: 422,
    body: {
        "error": "<MESSAGE>"
    }
}
```

#### Convertendo Moeda Randomico
```
Endpoint: /api/v1/convert-currency-random
Method: GET
Body: {}
Response Success: {
    status: 200,
    body: {
        "backingCurrency": "USD",
        "codeTo": "BRL",
        "CodeFrom": "USD",
        "priceTo": "0.2109",
        "priceFrom": 1,
        "exchangeRate": 0.2109,
        "amount": 500.5,
        "convertedAmount": 105.55545000000001,
        "priceToDate": "2022-04-07 15:00:01",
        "priceFromDate": "2022-04-07 15:00:01"
    }
}

Response Error: {
    status: 422,
    body: {
        "error": "<MESSAGE>"
    }
}
```
