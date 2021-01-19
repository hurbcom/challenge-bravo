## API Bravo

A API Bravo tem a função de registrar e gerenciar (CRUD) o cadastramento de moedas, bem como realizar a conversão monetária entre moedas suportadas. Ela foi desenvolvida utilizando o framework Flask do Python com o MongoDB servindo como banco de dados. A biblioteca `mongoengine` foi utilizada como ODM.

### Execução e documentação

A API pode ser executada através do script de start:

`./start.sh`

Esse script irá subir um docker-compose com três containers:

1. A API em si
2. O MongoDB
3. Uma migration inicial para cadastro da moeda padrão da API, no caso o real (código iso: BRL)

A API Bravo é acessível via endereço base: `http://localhost:8080`, contendo uma única API (Currency API) atualmente e acessível via `http://localhost:8080/api/currency`. A documentação da API Bravo pode ser consultada no endereço `http://localhost:8080/apidocs`.

A documentação foi desenvolvida com o padrão OpenAPI e gerada com a biblioteca flasgger do Python. A API também poderá ser utilizada diretamente via Swagger.

### Testes

Testes automatizados também estão disponíveis com **92.57%** de cobertura. Os testes podem ser executados através do script run_docker_test:

`./run_docker_test.sh`

O qual utilizará um docker-compose para realização dos testes.

### Alguns pontos de melhoria

- Foram utilizados arquivos .env* na raíz do projeto para armazenar as credenciais e dados sensíveis da aplicação. Em um contexto real, esses arquivos não seriam versionados no Git, mas o foram aqui para facilitar o uso inicial da aplicação. Além disso, uma melhor abordagem do que a utilização de arquivos .env seria a utilização de serviços com AWS KMS, AWS Parameter Store, Google Cloud Secret Manager, HashiCorp Vault, dentre outros.
- A API Bravo utiliza no momento uma API externa pública disponível no endereço `https://docs.awesomeapi.com.br/api-de-moedas` para consulta das cotações da moedas. A moeda de lastro utilizada por esta API é o BRL. Assim, a API Bravo apesar de permitir que outra moeda seja escolhida como moeda de lastro, configurando o atributo **standard** para a moeda em questão no banco de dados, esta API externa de conversão só permite que o BRL seja usado. Desta forma, a API Bravo, permite a moeda de mudança de lastro, mas gerará um erro proposital caso uma cotação seja solicitada e a moeda padrão seja diferente de BRL. Por este motivo, a moeda BRL é inserida via migration na aplicação ao ser iniciada, além de facilitar um uso inicial da aplicação.
- Um pipeline de CI/CD poderia ser configurado para esta aplicação, após escolha de alguma forma de deploy da aplicação.


--------------------

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

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
