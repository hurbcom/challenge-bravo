# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Tecnologias utilizadas:
 - node 12
 - [Koa](https://koajs.com/)
 - [Koa-router](https://github.com/ZijianHe/koa-router) rotas da app
 - [koa-bodyparser](https://github.com/koajs/bodyparser) Faz parse do que I/O
 - [koa-helmet](https://www.npmjs.com/package/koa-helmet) Inclui 11 middleware de segurança
 - [koa-json](https://github.com/koajs/json) Middleware simples para converter objeto JS em JSON no KOA
 - [Jest](https://jestjs.io/docs/en/getting-started) Para mock tests
 - [Docker](https://www.docker.com/)

## Como subir a aplicação

```
  docker build -t node-app .
```

```
  docker run -p 3000:3000 -d node-app
```

## Como rodar os testes
 `não esqueça o npm install antes.`
```
  npm run test
```

## API

```
http://localhost:3000/v1/exchange?from=EUR&to=USD&amount=1000
```
```
http://localhost:3000/health
```

## Explicações

O problema consiste em fazer conversões de moedas tendo o USD como lastro, assim criei um mapa de USD para todas as outras moedas existentes na aplicação e realizei simples contas para retornar o valor de acordo com as moedas e valor informado.

Arquitetura utilizei o pattern [DDD](https://en.wikipedia.org/wiki/Domain-driven_design) como tenho apenas um domínio e para esse problema me pareceu mais simples.

Realizei testes unitário utilizando o Jest e com o [DI](https://en.wikipedia.org/wiki/Dependency_injection)(injeção de dependências), ficou simples mockar e tendo uma entrada esperar a mesma saída sempre.

Utilizei algumas bibliotecas de segurança que acho importantes em aplicações nodeJs.

Poderia ter utilizado [PM2](https://pm2.keymetrics.io/) ou [Forever](https://www.npmjs.com/package/forever), para subir a aplicação e utilizar todos os CORE's da máquina, como o nodeJs é sigle thread, isso faria com que a aplicação fosse mais resiliente tendo um nó por core.

## Teste de stess
Realizei um teste simples fazendo mil requests pelo postman

## Commits
Utilizo o pattern de [Karma commits](http://karma-runner.github.io/5.2/dev/git-commit-msg.html), com foi uma aplicação simples não utilizei.


--------------------------------------------------------------------------------------------

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

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
