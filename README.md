# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

A Hurb Currency Converter é um serviço simples construído em Node.js baseado em API REST para conversão de valores entre diferentes moedas com cotações atuais.

A API busca a cotação de moedas através do serviço [CoinAPI](https://coinapi.io), por padrão já dá suporte à conversão entre as seguintes moedas:
-   USD
-   BRL
-   EUR
-   BTC
-   ETH

# Tecnologias utilizadas
- Node.js
- Typescript
- Sequelize (ORM)
- Jest (testes automatizados)
- Inversify (Inversão de controle)
- Swagger (documentação)
- Docker (containerização)
- Postgres (banco de dados)
- SQLite (banco de dados de testes)
- Redis (servidor de cache)
- Entre outras;

# Como iniciar

1. Clone o projeto:
```bash
$ git clone git@github.com:n0minal/challenge-bravo.git
```

2. Rode o projeto com docker, nenhum passo adicional é necessário:
```bash
$ docker-compose up -d --build
```

3. Após iniciada a aplicação, utilize a documentação do SwaggerUI para realizar conversões e manipular moedas suportadas pela API:
```bash 
https://localhost:3000/docs
```
## Limitações

-   Infelizmente por ser uma plataforma paga, a CoinAPI limita o uso de tokens gratuitos a 100 requisições diárias, mas no geral as rotas que utilizam a plataforma utilizam cache com o Redis, garantindo um maior número de requisições.

<p align="center">
  <img src="cc.jpg" alt="Challange completed" />
</p>
