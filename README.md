# Currency-API

## Dependencias

- Docker

## How to Run

- git clone $projeto
- cd $projeto
- docker-compose -f "docker-compose.yml" up -d --build
- a API vai estar funcionando na porta :8081 do seu localhost

## Resoluções
- Nesse Teste Resolvi praticamente todos os pontos levantados, o unico que ficou pendente e que a Moeda ETH nao funciona, ja que ela não existe na API externa de currency que consumo.

- O lastro das moedas e guardado em cache no mysql por 2 horas, e depois irá ser atualizado novamente na API externa

## Exemplos de Rotas
- Gerar troca:
    - GET localhost:8081/currency/exchange?from=USD&to=BRL&amount=123.45
- Atualizar moeda:
    - PUT localhost:8081/currency/update?currency=BTC
- Criar moeda:
    - POST localhost:8081/currency/create?currency=JPY
- Exemplo de chamada usada para api externa:
    - GET https://openexchangerates.org/api/latest.json?app_id=fc5abd9d7227492eaad1feb591e6c7fa&base:=USD&prettyprint=true&symbols=ETH

## BoilerPlate Code
    - O unico codigo gerado por boilerplate foram os arquivos que estão dentro de conversion-api/currency/mocks gerado pela biblioteca Mockery: <https://github.com/vektra/mockery>

## Contato
    - Qualquer coisa Email me: felipe.pbgomes@gmail.com