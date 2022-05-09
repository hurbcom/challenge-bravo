# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

[[English](README.md) | [Português](README.pt.md)] 

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com **cotações de verdade e atuais**. Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP. A API precisa contemplar cotações de verdade e atuais através de integração com APIs públicas de cotação de moedas. Mais detalhes em [challenge-bravo](https://github.com/hurbcom/challenge-bravo)


# Currency-Conversion
Foi desenvolvido uma aplicação para conversão monetária de moedas reais (incluindo criptomoedas) e fictícias, de acordo com os requisitos do desafio. A aplicação consiste de:
  - API Web - Feito em [ASP.NET Core 6.0](https://dotnet.microsoft.com/en-us/apps/aspnet), expões rotas para conversão e operações de CRUD de moedas.
  - Base de dados - Foi utilizado o sistema de banco de dados [PostgreSQL](https://www.postgresql.org/) para persistência das informações de moedas.
  - Tarefa de segundo plano - Feito em [.NET 6.0](https://docs.microsoft.com/en-us/dotnet/core/whats-new/dotnet-6). Progama em execução permanente, com uma rotina intermitente de alimentação de cotações reais na base de dados. O provedor desses dados foi uma API do [CoinBase](https://developers.coinbase.com/api/v2#exchange-rates).


# Execução

**Requisitos**:
- Docker
  
A aplicação como um todo foi desenvolvida para implantação em um container docker. Todos os serviços do container estão definidos no arquivo [docker-compose.yml](currency-conversion/docker-compose.yml).
1. Para build da imagem, execute `docker-compose build`. 
2. Para iniciar aplicação, execute `docker-compose up`

Ao iniciar a aplicação:
- A base de dados ficará disponível. Na primeira execução do container, o [script](currency-conversion/currency-conversion.infrastructure/assets/dbscripts/seed.sql) será executado, criando a estrutura da base. 
- A tarefa em segundo plano será iniciada, já iniciando a primeira iteração de busca e atualização de moedas. Na primeira execução do container, essa rotina irá inserir todas as moedas obtidas pela API externa. O intervalo de tempo entre cada iteração é definido por variável de ambiente, por padrão: 5min.
- A API web ficará disponível para requisições na porta 5000.
- Um gerenciador de conteúdo em base de dados [Adminer](https://www.adminer.org/) ficará disponível na porta 8080.
  - Para acessar é necessário realizar o login da base: `System: PostgreSQL; Server: postgres_image; Username: admin; Password: admin; Database: currencyDB.`


## Variáveis de ambiente

As seguintes variáveis de ambiente são utilizadas pelos serviços do container:
- **DB_CONNECTION_STRING** : Connection string da base de dados
- **POSTGRES_USER** : Usuário para acesso à base de dados.
- **POSTGRES_PASSWORD** : Senha para acesso à base de dados.
- **POSTGRES_DB** : Nome da base de dados
- **COINBASEAPI_URL** : Url da API de cotações do CoinBase.
- **COINBASEAPI_FETCH_INTERVAL_MS** : Intervalo de tempo (em ms) para busca e atualização de moedas.

# Utilização da API

A API possui os seguintes recursos: `/Currency` para operações de CRUD de moeda e `/Convert` para conversão de moedas. Todas as rotas seguem a convenção REST e os retornos são em JSON. A API Web também disponibiliza o recurso `/Swagger` para documentação da API de acordo com a especificação [OpenAPI](https://www.openapis.org/) gerado pelo [Swagger](https://swagger.io/)

## /Currency

- GET `/currency` Retorna todas as moedas disponíveis.
  - Exemplo: `curl -X 'GET' \
  'http://localhost:5000/Currency' \
  -H 'accept: */*'`
    - Resposta: Código 200, Corpo da resposta: `[
  {
    "code": "FORTH",
    "rate": 0.2247191011235955
  },
  {
    "code": "FOX",
    "rate": 4.4732721986132855
  },
  {
    "code": "FX",
    "rate": 2.7037988373665
  },
  {
    "code": "GAL",
    "rate": 0.1007658202337767
  },...`
- GET `/currency?code={code}` Retorna uma moeda com o código especificado no parâmetro de url
  - Exemplo: `curl -X 'GET' \
  'http://localhost:5000/Currency?code=HURB' \
  -H 'accept: */*'`
    - Resposta: Código 200, Corpo da resposta: `{
  "code": "HURB",
  "rate": 2
}`
- POST `/currency` Registra uma nova moeda a partir do código e cotação no corpo da requisição
  - Exemplo: `curl -X 'POST' \
  'http://localhost:5000/Currency' \
  -H 'accept: /' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "HURB",
  "rate": 2
}'`
    - Resposta: Código 200, Descrição: Currency added
- PUT `/currency` Atualiza o cotação de uma moeda a partir do código e cotação no corpo da requisição
  - Exemplo: `curl -X 'PUT' \
  'http://localhost:5000/Currency' \
  -H 'accept: /' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "HURB",
  "rate": 4.5
}'`
      - Resposta: Código 200, Descrição: Currency updated
- DELETE `/currency?code={code}` Remove uma moeda a partir do código especificado no parâmetro de url
  - Exemplo: `curl -X 'DELETE' \
  'http://localhost:5000/Currency?code=HURB' \
  -H 'accept: */*'`
    - Resposta: Código 200, Descrição: Currency deleted

DTO utilizado no corpo da requisição para as rotas de métodos POST e PUT
`
{
    code: string
    rate: number($double)
}
`

## /Convert

- GET `/convert?from={code}&to={code}&amount={value}`
  - Exemplo: 
    Requisição: `curl -X 'GET' \ 'localhost:5000/convert?from=brl&to=usd&amount=500' \ -H 'accept: */*'`
    Resposta: Código 200, Corpo da resposta: 2539.2

## Resposta de erro:

- Http 400: Caso o código de uma nova moeda já exista na base.
- Http 404: Quando a requisição tenta acessar uma moeda cujo código não existe na base
- Http 500: Para erros internos não mapeados.


Para mais detalhes, como parâmetros obrigatórios e validações, a documentação completa se encontra em [swagger.json](currency-conversion/currency-conversion.web/swagger.json).
