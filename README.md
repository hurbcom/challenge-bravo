# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Notas do candidato

Optei por utilizar Node com Typescript para o desenvolvimento do desafio por questões de familiaridade e relembrar um pouco desta linguagem. Utilizei alguns pacotes, listados no tópico abaixo, para auxiliar o desenvolvimento.

Como vulnerabilidades do sistema eu apontaria a falta de autenticação (eu utilizaria JWT) e a falta do SSL para o servidor. Não implementei ambas, mas acho importante ressalta-las aqui.

### Pacotes utilizados

#### Pacotes de desenvolvimento

- ```jest``` e ```ts-jest``` - Utilizado para os testes de unidade;
- ```supertest``` - Utilizado para os testes de unidade relacionados a chamadas da API;
- ```ts-node``` - Utilizado para execução local do projeto utilizando Typescript ao invés do Javascript;
- ```typescript``` - Compilador do Typescript

#### Pacotes usados em produção

- ```body-parser``` - Utilizado pelo Express para fazer parsing do body das requisições;
- ```express``` - Utilizado para gerenciamento das rotas da API e pelo servidor;
- ```got``` - Utilizado para fazer chamadas HTTP externas. Optei pelo uso desse pacote, ao invés do ```http``` nativo do Node, por suportar o modelo async/await;
- ```inversify``` e ```reflect-metadata``` - Utilizado para a injeção de dependências do projeto;
- ```pg``` - Conector para Postgres;

### Instruções para execução

### Docker

- Solução está montada utilizando dois containers (um com a aplicação e um com um banco de dados usando Postgres) em uma pattern side-car;
- A execução do mesmo se dá através dos comandos do ```docker-compose``` abaixo a partir da raiz do projeto:
  - ```docker-compose build``` - Constrói ambos os containers
  - ```docker-compose up``` - Inicia ambos os containers em modo verboso. Para executar em modo silencioso, adicionar ```-d``` ao comando
- O container da aplicação só é iniciado após o serviço do Postgres iniciar e estar de prontidão. Essa verificação é feita através da ferramenta [Dockerize](https://github.com/jwilder/dockerize) quer verifica se a porta do Postgres está disponível para uso;

### Execução local

Para execução local é necessário seguir os seguintes passo:

1. Instalar as dependências do projeto usando o comando ```npm install``` ou ```npm i```;
1. Iniciar o container do Postgres, localizado na pasta ```resources/docker/database```;
1. Iniciar a aplicação usando o comando ```npm run build-prod``` que irá compilar o projeto e iniciar o mesmo;

### Visual Studio Code

Caso deseje, também é possível executar a aplicação conectado ao Visual Studio Code para depurar. Para isso, além de executar a instalação das dependências e o container do Postgres, também são necessários os seguintes passos:

1. Instalar as dependências de desenvolvimento usando o comando ```npm install --only=dev```;
1. Iniciar o compilador do TypeScript com o comando ```npm start```;
1. Apertar F5 no Visual Studio Code para iniciar a aplicação e se conectar ao Debugger

## Testes de carga

Os testes de carga usam como base a rota ```/exchange``` e utilizam o [Artillery](https://artillery.io) para fazer as chamadas. Para execução do teste, após a instalação da ferramenta conforme instruções do site, é só executar o script ```artillery.sh``` localizado na raiz do projeto.

## Rotas

Existem exemplos de chamadas para as rotas utilizadas na pasta ```resources/http_calls```. As rotas criadas são as seguintes:

- ```GET /currencies/:currencyId``` - Retorna o objeto Currency identificado pelo id;
- ```GET /currencies``` - Retorna todas as moedas cadastradas no sistema;
- ```POST /currencies``` - Adiciona uma nova moeda ao sistema;
- ```DELETE /currencies/:currencyId``` - Exclui a moeda identificada pelo id
- ```GET /exchange?from=ABC&to=DEF&ammount=1``` - Efetua a conversão do valor do campo ammount entre as moedas identificadas nos campos from e to

---

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
