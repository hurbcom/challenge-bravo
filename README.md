## 🏃‍♂️ Rodando o projeto

- Clone ou baixe o repositório.
- Nessa aplicação é utilizado a API presente neste  <a href="https://rapidapi.com/natkapral/api/currency-converter5?endpoint=apiendpoint_b0d109c2-e479-4f70-be68-ab4dbe08cfcf">link</a>
- No arquivo `.dotenv` insira a key da api da <a href="https://rapidapi.com/">RapidAPI</a>
- Crie uma imagem do Postgres no docker rodando o seguinte comando <br/>`docker run --name postgresImage -e POSTGRES_PASSWORD=UmaSenhaBoa -p 5432:5432 
-d postgres`
- Crie um banco de dados com o nome "challenge_bravo"
- `cd challenge-bravo` para entrar na pasta do projeto
- `yarn` para instalar todas as dependências.
- `yarn typeorm migration:run` para criar a estrutura do banco de dados
- `yarn dev:server` para iniciar API.

## ✈ Rotas da aplicação

<h3>Após instalar o projeto as seguintes rotas estarão disponíveis em http://localhost:3333</h3>


-   <p>Rota para cadastrar uma nova moeda no banco de dados</p>
    POST /currency <br/>
    Cadastrar moedas :<br/>
    `{ "name": "EUR" } `
    
<h4>Cadastrar o nome da moeda que deseja utilizar para converter</h4>


-   <p>Rota para listar moedas cadastradas no banco de dados</p>
    GET /currency/index



- <p>Rota para converter o valor das moedas</p>
    GET /currency
    Query Params = `?from=USD&to=EUR&amount=1`
    
- <p>Resposta da rota de converter moedas</p>
   {<br/>
        base_currency: USD,<br/>
        amount_base: 1.000,<br/>
        converted_currency: EUR,<br/>
        amount_converted: 0.8500,<br/>
     }<br/>
   
   


## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [TypeScript](https://www.typescriptlang.org/)
- [Node](https://nodejs.org/en/)
- [Express](https://expressjs.com/pt-br/)
- [PostGres](https://www.postgresql.org/)
- [Axios](https://github.com/axios/axios)
- [Cors](https://expressjs.com/en/resources/middleware/cors.html)
- [DotEnv](https://www.npmjs.com/package/dotenv)
- [TypeORM](https://typeorm.io/#/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/) 

# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:

-   JavaScript (NodeJS)
-   Python
-   Go
-   Ruby
-   C++
-   PHP

## Requisitos

-   Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um _pull request_.
    -   Caso você tenha algum motivo para não submeter um _pull request_, crie um repositório privado no Github, faça todo desafio na branch **master** e não se esqueça de preencher o arquivo `pull-request.txt`. Tão logo termine seu desenvolvimento, adicione como colaborador o usuário `automator-hurb` no seu repositório e o deixe disponível por pelo menos 30 dias. **Não adicione o `automator-hurb` antes do término do desenvolvimento.**
    -   Caso você tenha algum problema para criar o repositório privado, ao término do desafio preencha o arquivo chamado `pull-request.txt`, comprima a pasta do projeto - incluindo a pasta `.git` - e nos envie por email.
-   O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
-   Para executar seu código, deve ser preciso apenas rodar os seguintes comandos:
    -   git clone \$seu-fork
    -   cd \$seu-fork
    -   comando para instalar dependências
    -   comando para executar a aplicação
-   A API pode ser escrita com ou sem a ajuda de _frameworks_
    -   Se optar por usar um _framework_ que resulte em _boilerplate code_, assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.
-   A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.

## Critério de avaliação

-   **Organização do código**: Separação de módulos, view e model, back-end e front-end
-   **Clareza**: O README explica de forma resumida qual é o problema e como pode rodar a aplicação?
-   **Assertividade**: A aplicação está fazendo o que é esperado? Se tem algo faltando, o README explica o porquê?
-   **Legibilidade do código** (incluindo comentários)
-   **Segurança**: Existe alguma vulnerabilidade clara?
-   **Cobertura de testes** (Não esperamos cobertura completa)
-   **Histórico de commits** (estrutura e qualidade)
-   **UX**: A interface é de fácil uso e auto-explicativa? A API é intuitiva?
-   **Escolhas técnicas**: A escolha das bibliotecas, banco de dados, arquitetura, etc, é a melhor escolha para a aplicação?

## Dúvidas

Quaisquer dúvidas que você venha a ter, consulte as [_issues_](https://github.com/HurbCom/challenge-bravo/issues) para ver se alguém já não a fez e caso você não ache sua resposta, abra você mesmo uma nova issue!

Boa sorte e boa viagem! ;)
