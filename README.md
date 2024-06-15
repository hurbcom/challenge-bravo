# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

## Descrição

Esta é uma API para conversão monetária. Ela suporta conversões entre diversas moedas, incluindo moedas fiduciárias, criptomoedas e moedas fictícias. A moeda de lastro utilizada é o USD, e as cotações foram obtidas de APIs públicas para garantir que sejam reais e atuais.

A solução foi desenvolvida utilizando, TDD, DDD, Ports & Adapters, Clean Architecture, design-patterns e outras estratégias arquiteturais. Sei que essa arquitetura pode ser considerada demasiadamente robusta para um projeto tão pequeno, mas o intuito é mostrar o que tenho em minha "caixa de ferramentas" e também dar a vocês material de análise de minha forma de codificar. No dia a dia gosto de dimensionar a solução de software para alcançar o melhor proveito no negócio.

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Hapi
- Swagger UI
- PostgreSQL
- Docker
- Jest

## Endpoints

Indico fortemente a utilização do swagger para consultar a documentação da API e também para executar as requests. Essa documentação pode ser acessada no endereço `http://locahost:3000/api-docs`, mas caso queira ou precise testar utilizando uma ferramenta de requisições http como Postman, o endereço base para as requisições é o `http://localhost:3000/api/v1`.

### Lista Paginada de Moedas

Este endpoint não foi solicitado no desafio mas decidi fazer para ter um bom exemplo da utilização de CQRS. Eu fiz a _query_ do _[ GET ] /currencies/{code}_ também mas ela sozinha não realça as vantagens da separação de comandos e consultas. É importante também mencionar que este endpoint apenas estará disponível se o projeto for inicializado com `yarn start` ou `yarn dev`. O único objetivo desse comportamento é mostrar que as rotas também são configuráveis sem afetar a aplicação.

`[ GET ] /currencies`

```json
// query
{
  "currencies": [],     // Código das moedas a serem filtradas
  "page": 1,            // Página corrente
  "perPage": 10,        // Quantidade de registros por página
  "sortBy": "name",     // Campo pelo qual a consulta será ordenada
  "sortOrder": "asc",   // Direção da ordenação
}
```

```json
// response schema
{
  "meta": {
    "page": 0,
    "perPage": 0,
    "pageCount": 0,
    "totalCount": 0
  },
  "data": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "symbol": "string",
      "decimalDigits": 0,
      "rate": 0.1
    }
  ]
}
```

### Adiciona uma nova moeda

O desafio não define ou esclarece quem utilizará essa API, então pensando em praticidade, ao invés de pedir o _rate_ (valor proporcional de uma moeda em relação à moeda de lastro), que resultaria em um cadastro simples, eu preferi solicitar o valor da nova moeda bem como de uma moeda equivalente. Podemos inclusive seguir o exemplo citado no desafio do cadastro de uma moeda fictícia do GTA onde \$ 1.250.000,00 no jogo custam R$ 83,50 no mundo real. Com isso calculamos o valor proporcional da moeda em dólar.

`[ POST ] /currencies`

```json
// body
{
  "name": "Grand Theft Auto Dollar",
  "code": "GTA",
  "symbol": "GTA$",
  "baseAmount": 1250000.00,
  "equivalentCurrencyAmount": 83.50,
  "equivalentCurrencyCode": "BRL"
}
```

```json
// response schema
{
  "currencyId": "string"
}
```

### Converte uma moeda em outra

A descrição do desafio propõe a API de conversão de moeda mas não diz como deve ser seu retorno. Por isso tomei a liberdade de devolver um objeto com algumas informações que julguei serem uteis em uma API real de conversão.

`[ POST ] /currencies/convert`

```json
// query
{
  "from": "string",
  "to": "string",
  "amount": 0.1,
}
```

```json
// response schema
{
  "from": "string",
  "to": "string",
  "givenAmount": 0.1,
  "convertedAmount": 0.1,
  "convertedAmountFormatted": "string",
  "decimalDigits": 0,
  "symbol": "string"
}
```

### Recupera uma moeda específica

Esse endpoint também não foi solicitado no desafio mas ele é super importante nos testes automatizado garantido que as moedas criadas na aplicação foram criadas corretamente.

`[ GET ] /currencies/{code}`

```json
// param
{
  "code": "string",
}
```

```json
// response schema
{
  "id": "string",
  "name": "string",
  "code": "string",
  "symbol": "string",
  "decimalDigits": 0,
  "rate": 0.1
}
```

### Exclui uma moeda do repositório

`[ DELETE ] /currencies/{code}`

Todas as configurações dessa aplicação (veja mais [aqui](#ancora1)) oferecem a possibilidade de criar e remover moedas, mas no caso das configurações que utilizam o gateway externo, apenas as novas moedas podem ser removidas.

```json
// param
{
  "code": "string",
}
```

```json
// response schema
{
  "message": "string",
}
```


## Como Executar

### Pré-requisitos

- Docker & Docker Compose (caso queira rodar com o banco de dados postgres)
- Node
- Yarn (opcional)

### Preparação do repositório

1. Clone o repositório:

```shell
$ git clone https://github.com/hurbcom/challenge-bravo.git
```

2. Navegue até o diretório do projeto:

```shell
$ cd challenge-bravo
```

3. Acesse a branch que criei com a solução do desafio:

```shell
$ git checkout 'leandro/challenge-implementation'
```

### Passos para rodar a aplicação no Docker

1. Construa e inicie os containers Docker:

```shell
$ docker-compose build
...
$ docker-compose up
```

* _Para parar a aplicação execute ctrl+D no terminal_
* _Para parar o container execute `docker-compose down`_

### Passos para rodar a aplicação localmente

1. Instale as dependências

```sh
$ yarn install
```

2. Inicie o banco de dados via docker-compose

```sh
$ docker-compose up db
```

1. Inicie a aplicação

```sh
$ yarn start
```

* _Para parar a aplicação execute ctrl+D no terminal_

<a id="ancora1"></a>

> Há ainda outros scripts de inicialização que podem ser utilizados. Cada um sobe o servidor com uma configuração diferente:
> - `start` ou `dev`: Inicia o servidor express com swagger UI e repositório postgres que roda no docker;
> - `dev:express+fake`: Iniciar o servidor express com swagger UI e Repositório em memória;
> - `dev:hapi+fake`: Inicia o servidor hapi com repositório em memória;
> - `dev:express+gw-on`: Inicia o servidor express com swagger UI e o repositório utiliza o gateway currencyapi.com para ter a contação do dia de forma online.
> - `dev:express+gw-off`: Inicia o servidor express com swagger UI e simula a requisição para o gatewayapi.com (para fins de testes sem fazer requisições reais pois são liberadas apenas 300 requisições/mês)

### Executar testes

```sh
$ yarn test
```
- Também pode ser utilizado o `yarn test:watch` que roda os testes com a flag `--watch`.