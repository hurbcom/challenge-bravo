# Desafio Hurb - Bravo

API para conversão de moedas para o desafio do Hurb.

## Tecnologias utilizadas

API desenvolvida em NodeJS (v10.16) com a utilização dos seguintes pacotes:

-   Core
    -   [express](https://github.com/expressjs/express)
    -   [helmet](https://github.com/helmetjs/helmet)
    -   [axios](https://github.com/axios/axios)
    -   [redis](https://github.com/NodeRedis/node_redis)
-   Testes
    -   [mocha](https://github.com/mochajs/mocha)
    -   [chai](https://github.com/chaijs/chai)
    -   [nyc](https://github.com/istanbuljs/nyc)
    -   [supertest](https://github.com/visionmedia/supertest)
    -   [nock](https://github.com/nock/nock)
-   Infraestrutura
    -   [pm2](https://github.com/Unitech/pm2)

Para gerar o ambiente da aplicação estou utilizando o docker/docker-compose e criei um Dockerfile
que pode ser usado tanto em produção quanto desenvolvimento e não utiliza o usuário root para
executar as operações.

Para gerenciar o processo do node, escolhi utilizar o PM2 rodando no modo de cluster.

## Iniciando a aplicação

Para rodar a aplicação:

```
cd $pasta-da-aplicacao
docker-compose build --no-cache
docker-compose up -d
```

Depois basta acessar `http://localhost:3000`

O endpoint para conversão é `http://localhost:3000/convert`

Exemplo: `http://localhost:3000/convert?from=BTC&to=EUR&amount=123.45`

## Executar testes

Para executar os testes execute unitário e exibir a cobertura de cógio:

```
docker-compose exec app npm run test:coverage
```

Para rodar os testes de estresse:

```
docker-compose exec app npm run test:stress
```

## Monitoramento

Para abrir o monitor dos processos do PM2 basta executar:

```
docker-compose exec app pm2 monit
```

Pode ser interessante deixar aberto enquanto realiza os testes de estresse.

## Iniciar aplicação no modo de desenvolvimento

```
cd $pasta-da-aplicacao

export USER_ID=${UID} && docker-compose -f docker-compose.dev.yml build
ou
export USER_ID="$(id -u)" && docker-compose -f docker-compose.dev.yml build

docker-compose -f docker-compose.dev.yml up -d
```
