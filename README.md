# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> API Conversão de moedas - Desafio Hurb

## Indíce
* [Sobre o projeto](#about-problem)
    * [Desafio Hurb](#about-problem)
    * [Tecnologias](#about-techs)
* [Requisitos](#requirements)
* [Instalação](#instalation)
* [Funcionamento](#running)
    * [Listar todas as moedas](#running-api-all)
    * [Converter moeda](#running-api-convert)
    * [Cadastrar nova moeda](#running-api-create)
    * [Deletar moeda](#running-api-delete)
    * [Documentação](#running-api-docs)
* [Testes](#tests)
* [Todo](#todo)


<a name="about-problem"></a>
## Desafio - Hurb
---
O intuito deste projeto é solucionar o desafio proposto pelo teste técnico _bravo_ da Hurb. O desafio consiste em criar uma aplicação para converter moedas com base no dólar. 

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

Moedas inicialmente suportadas (chamadas de _default_):
- USD
- BRL
- EUR
- BTC
- ETH

<a name="about-techs"></a>
## Tecnologias
---
- Postgres
- Node.js
- Express
- Sequelize
- Redis
- Jest

<a name="requirements"></a>
## Requisitos
---
- Git
- Docker
- Docker composer
- Node >= 13

<a name="instalation"></a>
## Instalação
---
Na raiz do projeto existe um arquivo chamado `.env-example`, é necessário renomea-lo para `.env`.
```sh
cp .env.example .env
```

Inicie o container docker:
```sh 
yarn docker:prod
```
ou em modo desenvolvimento:
```sh 
yarn docker:dev
```

Execute o comando para criar e popular o banco de dados:
```sh
yarn config:database
```

A aplicação estará disponível através do endereço: http://localhost:3000

<a name="running"></a>
## API - Funcionamento (endpoints)
---
```
GET /currencies
GET /currencies/convert/:from/:to/:amount
POST /currencies
DELETE /currencies/{currency}
GET /docs
```
<a name="running-api-all"></a>
### GET /currencies - Lista de moedas cadastradas
Requisição para listar todas as moedas cadastradas

<a name="running-api-convert"></a>
@@### GET /currencies/convert/:from/:to/:amount - Converter moeda
Requisição para realizar a conversão entre 2 moedas.

**Parâmetros:**
- **from**: Moeda de origem.
- **to**: Moeda para qual o valor será convertido.
- **amount**: Valor da moeda de origem que será convertido.

<a name="running-api-create"></a>
### POST /currencies - Cadastrar moeda
Requisição para cadastrar uma nova moeda.

**Corpo da requisição:**
```
{
    "name": "Doge coin",
    "symbol": "PAC",
    "rate": 5
}
```

<a name="running-api-delete"></a>
### DELETE /currencies/{id} - Deletar uma moeda
Requisição para remover uma moeda

**Parâmetros:**
- **id**: Idenfiticação da moeda no banco de dados (Inteiro).

<a name="running-api-docs"></a>
### GET /docs - Documentação da api
Página responsável por especificar os _endpoints_ da aplicação.

<a name="running-api-docs"></a>
## Tests
---
Para executar os testes, rode o comando:
```sh 
yarn docker:test
```
Para exibir a cobertura dos testes, adicione o parametro **`--coverage`** no comando acima.

<a name="running-api-docs"></a>
## Todo
---
- [ ] Aumentar cobertura dos testes unitários
- [ ] Separar arquivo de configuração (Ex: config/database.js, config/cache.js, config/app.js)
- [ ] Salvar log de erros e eventos
- [ ] Autorizar consumo da API a partir de token válido