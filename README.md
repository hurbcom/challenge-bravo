# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo
Esse projeto faz parte do desafio de Challenge-brado da HUB

## Começando

Para executar o projeto, será necessário instalar os seguintes programas:

Git
Node
Visual Studio Code

## Desenvolvimento

Para iniciar o desenvolvimento, é necessário clonar o projeto do GitHub num diretório de sua preferência:

cd diretórioDeSuaPreferência
git clone https://github.com/cirelalespier/challenge-bravo

### Construção

Para baixar as dependências do projeto, executar o comando abaixo:

npm i

### Rodar aplicação

Para iniciar o projeto, executar o comando abaixo:

node src/app.js

#### Listar moedas

Descrição: Endpoint que permite listar as moedas a serem convertidas.

**MÉTODO HTTP / RECURSO**

##### GET /

#### Converter moedas

Descrição: Endpoint que permite a conversão entre duas moedas.

**MÉTODO HTTP / RECURSO**

##### POST /

**REQUEST QUERY**

  from: { type: string, required: true },
  to: { type: string, required: true },
  amount: { type: number, required: true }

Example:

  from: "USD",
  to: "BRL",
  amount: 123.0

#### ADICIONAR MOEDA

Descrição: Endpoint que permite a criação de uma moeda no banco de dados.

**MÉTODO HTTP / RECURSO**

##### PUT /

**REQUEST BODY**

    currency: { type: string, required: true }

Example:

```json
{
  "currency": "ABC"
}
```

#### EXCLUIR MOEDA

Descrição: Endpoint que permite excluir uma moeda no banco de dados.

**MÉTODO HTTP / RECURSO**

##### DELETE /:id

**REQUEST PARAMs**

    id: { type: string, required: true }

### Rodar testes unitários da aplicação

Para iniciar os testes unitários do projeto, executar o comando abaixo:

npm test

# Licença

Não se aplica.

## Decisões de projeto

### Framework
Escolhi usar o Express.js como framework, por ser um framework leve, rápido e flexível que fornece recursos robustos para criar aplicações em Node.js.

### Banco de dados

Utilizei o banco de dados MongoDB com Mongoose, por se tratar de trocas de informações no projeto baseadas em chave a valor, e por necessitar de consultas rápidas e eficientes.

# Desafio

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

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

## Contato

Estou à disposição para dúvidas e sugestões!

** Cirela Lespier | lespier.cirela@gmail.com **