## Api de cotação de moedas.

Api desenvolvida para o calculo de conversão de moedas, usando como base uma api externa com as cotações em tempo real.
Para o desenvolvimento, foram utilizados as tecnologias: Python, Django, Tastypie, PostgreSQL, Docker e a ORM do próprio Django.

Na arquitetura, foi usada a MVT, porém os templates não foram implementados nesse projeto.

Foi utilizado um arquivo chamado connector que funciona como um Service para as requisições na API externa.

## Rotas
- **CRUD para as moedas suportadas pela API.**
    - GET -> Retorna a lista de moedas cadastradas:
        - curl -L -X GET 'http://localhost:8000/api/v1/currency/' -H 'Content-Type: application/json;charset=UTF-8'

    - POST -> Cadastra uma nova moeda:
        - curl -L -X POST 'http://localhost:8000/api/v1/currency/' -H 'Content-Type: application/json;charset=UTF-8' --data-raw '{"symbol": "JPY", "description": "Moeda do Japão"}'

    - PATCH -> Altera uma moeda:
        - curl -L -X PATCH 'http://localhost:8000/api/v1/currency/2/' -H 'Content-Type: application/json;charset=UTF-8' --data-raw '{"description": "Mudando a descrição de uma currency"}'

    - DELETE -> Deleta uma moeda:
        - curl -L -X DELETE 'http://localhost:8000/api/v1/currency/2/' -H 'Content-Type: application/json;charset=UTF-8'

- **Endpoint para converter moedas**
    - Exemplo:
    
    - POST -> Método para conversão de moedas(Único verbo suportado no endpoint)
        - curl -L -X POST 'http://localhost:8000/api/v1/currency/convert_value/?from=USD&to=BRL&amount=10' -H 'Content-Type: application/json;charset=UTF-8'

## Observações

- Para converter de uma moeda X para outra moeda Y, é necessário que as duas moedas estejam cadastradas pelo endpoint de cadastrar moedas. Inicialmente já possui as 5, porém, é necessário cadastrar a moeda em questão caso não seja uma das: USD, BRL, EUR, BTC ou ETH.
- Não é possível converter de uma moeda pra ela mesmo, nesse caso a api retornará um erro.


# Como rodar o projeto

- **Requisitos**
    - Docker
    - Docker-compose
   
- Clone o projeto no seu computador local, entre na pasta /challenge-bravo/hurb-project
- Execute o seguinte comando para buildar o projeto:
    -  sudo make build
 - Após buildar o projeto, vamos subir o projeto com o seguinte comando:
    - sudo make start
  - Para rodar os testes, abra um novo terminal(Certifique-se que o server esteja rodando em outro terminal) e rode o seguinte comando:
    - sudo make test
    
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------
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
