# Desafio Bravo

API para conversão de moedas desenvolvida com NodeJS e Typescript para o desafio do Hurb.

## Tecnologias utilizadas

- NodeJs
- Express
- Axios
- Redis
- IORedis - ORM

## Iniciando a aplicação


## Moedas disponíveis
A API, originalmente, converte entre as seguintes moedas:

- USD: Dólar americano
- BRL: Real brasileiro
- EUR: Euro
- BTC: Bitcoin
- ETH: Ethereum

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

Novas moedas podem ser adicionadas utilizando o endpoint `http://localhost:3333/currency/create`

Ex: `http://localhost:3333/currency/create?name=AUD&value=0.6771`
Onde name é o nome da moeda que será adicionada e value é o valor dela comparada ao dólar americano
Caso um valor não seja informado ele buscará na Awesome API pela moeda correspondente.
Essa adição automatizada está disponível somente para Dólar (USD, USDT, CA, AUD), Euro, Libra, Peso, Iene, Franco, Yuan Chinês, Shekel Israelense, Litecoin, Bitcoin, Ethereum e Ripple.

## Remoção de Moedas

O endpoint para remover moedas do banco de dados é `http://localhost:3333/currency/remove`
passando o nome da moeda que será removida.

EX: `http://localhost:3333/currency/remove?name=AUD`

## Busca de moeda

É possível buscar uma moeda específica no bando de dados e exibir o seu valor comparado com o dólar americano

EX: `http://localhost:3333/currency/recover?currency=BRL`

## Conversão de moedas

O endpoint de conversão é `http://localhost:3333/currency/convert`
A requisição recebe como parâmetros de query:
A moeda de origem: from ;
A moeda final: to ;
o valor a ser convertido: amount ;

Ex: `http://localhost:3333/currency/convert?from=BRL&to=USD&amount=123.45`

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
