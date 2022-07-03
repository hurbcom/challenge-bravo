# Bravo

### API para conversão de moedas reais, também com implementação para moedas fictícias.

#### Projeto concluído ✔️

[Sobre](#sobre) • [Tecnologias](#tecnologias) • [Instalação](#instalação)

## Sobre

Projeto criado para realizar conversões em tempo real de moedas, também pode criar moeda fictícia e realizar conversões entre mais de 100+ moedas. Foi criado uma [biblioteca](https://www.npmjs.com/package/kencrypto-coin-maker) somente para manter o controle das requisições da api externa [CoinMarketCap](https://coinmarketcap.com/api/documentation/v1/).

## Comentários, UX, Escolhas técnicas, Assertividade e Segurança
Segurança: o projeto usa uma key da api externa que só é possível realizar 333 requisições ao dia, incapaz de realizar o teste de estresse onde seriam feitas 1000 requisições. A key será enviado diretamente no .env para quem for avaliar não precisar se cadastrar no site e criar uma chave.

Assertividade: api realiza todas conversações de moedas reais ou não, porém a conversão entre duas moedas fictícias não é possível ainda, pois as conversões em moedas fictícias são mandadas em USD para a api externa e depois é calculado para obter o valor correto.

UX: api de fácil uso, é descrito abaixo como usar.

Escolhas técnicas: usei as tecnologias por familiaridade e organização do código. Mesmo somente com uma tabela, achei interessante deixar a estrutura mais organizada, caso um dia seja necessário acrescentar novas features. 


## Tecnologias
As seguintes ferramentas foram utilizadas na construção do projeto:

- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/en/about/)
- [Express](https://expressjs.com/)
- [Postgresql](https://www.postgresql.org/)
- [Jest](https://jestjs.io/)

## Instalação
É preciso que o Node.js esteja instalado na sua máquina, assim como docker compose. Também é necessário um gerenciador de pacotes como npm ou yarn.

Comece realizando o git clone em sua maquina:
```bash
git clone git@github.com:CalebeNavarro/challenge-bravo.git
```

Em seguinta entre no repositório:
```bash
cd challenge-bravo
```

Instale as dependências com o comando:
```bash
npm install

#ou

yarn
```

Em seguida, execute o projeto com:
```bash
docker compose up
```

# Moeda [/currency]

Trabalhando com moedas.
A conversão monetária para criação de uma moeda fictícia acontecem somente para dolar (USD). No exemplo abaixo, 1.250.000,00 moedas GTA equivalem a 85 USD

### Novo moeda (Create) [POST /currency]

+ Request (application/json)

    + Body

          {
            "symbol": "GTA",
            "name": "Test currency efective",
            "amount": 1250000.00,
            "price": 85
          }

+ Response 201 (application/json)

    + Body

          {
            "id": "a74ab22e-d32b-4e59-ac71-fd53d3432dfa",
            "last_updated": "2022-07-03T19:44:40.219Z",
            "date_added": "2022-07-03T19:44:40.219Z",
            "symbol": "GTA",
            "name": "Test currency efective",
            "price": 0.000068
          }

### Listar moedas (List) [GET /currency]

+ Response 200 (application/json)

      [
        {
          "id": "a74ab22e-d32b-4e59-ac71-fd53d3432dfa",
          "last_updated": "2022-07-03",
          "date_added": "2022-07-03",
          "symbol": "GTA",
          "name": "Test currency efective",
          "price": 0.000068
        }
      ]
      
### Atualizar moeda (Updated) [PATCH /currency/:currency_id]

+ Request (application/json)

    + URL

      /currency/a74ab22e-d32b-4e59-ac71-fd53d3432dfa

    + Body

          {
            "name": "Grand Theft Auto V",
            "amount": 125,
            "price": 10
          }

    + Response 200 (application/json)

          {
            "id": "a74ab22e-d32b-4e59-ac71-fd53d3432dfa",
            "last_updated": "2022-07-03",
            "date_added": "2022-07-03",
            "symbol": "GTA",
            "name": "Grand Theft Auto V",
            "price": 0.08
          }

### Deletar moeda (Delete) [DELETE /currency/:currency_id]

+ Request (aplication/json)

  + URL

    /currency/a74ab22e-d32b-4e59-ac71-fd53d3432dfa

+ Response 204 (application/json)

    No body returned for response


### Conversão das moedas (Listar) [GET /currency?from=:symbol&to=:symbol&amount=:amount]

+ Request (aplication/json)

  + URL

    /currency?from=GTA&to=EUR&amount=123.45

  + Response 204 (application/json)

        {
          "id": "a74ab22e-d32b-4e59-ac71-fd53d3432dfa",
          "symbol": "GTA",
          "name": "Grand Theft Auto V",
          "amount": 123.45,
          "last_updated": "2022-07-03",
          "quote": {
            "EUR": {
              "price": 9.472022220000007,
              "last_updated": "2022-07-03T20:03:23.000Z"
            }
          }
        }