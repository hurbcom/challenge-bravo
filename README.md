# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Como rodar

### Setup
```
make setup
```

### Run
```
make run
```

### Testes
```
make test
```

### Stress
```
make stress
```

## Tecnologias
* Python
* Flask
* Redis
* Requests
* Gunicorn
* Flask Caching
* Docker Compose


## API
* **GET:** http://ec2-18-228-221-6.sa-east-1.compute.amazonaws.com/convert/?from=USD&to=BRL&amount=1

Parâmetros de Get
* **from**: ID da moeda a ser convertida
* **to**: ID da moeda final
* **ammount**: Valor a ser convertido

Retorno 200
```javascript
{
  "from": "BRL",
  "to": "USD",
  "amount": 10,
  "value": 1.89
}
```

* **GET:** http://ec2-18-228-221-6.sa-east-1.compute.amazonaws.com/currencies/

Retorno 200
```javascript
{
  "count": 5,
  "results": [
    {
      "id": "USD",
      "rate": 1.0
    },
    {
      "id": "BRL",
      "rate": 5.2912
    },
    {
      "id": "EUR",
      "rate": 0.846475
    },
    {
      "id": "BTC",
      "rate": 0.000089325498
    },
    {
      "id": "ETH",
      "rate": 0.0025804730187676513
    }
  ]
}
```

* **POST:** http://ec2-18-228-221-6.sa-east-1.compute.amazonaws.com/currencies/

Body
```javascript
{
  "id": "EUR"
}
```

Retorno 201
```javascript
{
  "id": "EUR",
  "rate": 1.2,
}
```

* **DELETE:** http://ec2-18-228-221-6.sa-east-1.compute.amazonaws.com/currencies/EUR/

Retorno 204


## Decisões de projeto

### Framework
Escolhi usar o flask como framework para esse projeto, por se tratar de um projeto simples um micro framework como o flask dá conta do recado. Poderia ter usado também o Tornado, gosto dele pela velocidade e por trabalhar com requisições assíncronas e não blocantes, mas para esse projeto fiquei com a opção mais simples.

### Banco de dados
Optei por não usar um banco de dados convencional (MySql, Postgres, MongoDb) e usar o Redis, isso porque as operações necessárias nesse projeto envolvem apenas chave e valor, e para isso o Redis é extremamente rápido e eficiente. Também escolhi o Redis para fazer uso dele como cache e memoize. Se o projeto crescesse todos os containers da app poderiam se aproveitar de um cache centralizado.

Uma preocupação que todos tem com o Redis é o fato dele fazer o armazenamento em memória, como imaginei um tempo de cache muito curto para essa aplicação e os dados serão consumidos de outras APIs essa não é uma preocupação tão grande nesse projeto. Além disso é possível habilitar o Redis para guardar backups em disco.

### Imagens de docker
Eu comecei o projeto usando como imagem base do container web e db a distribuição Alpine, mas ao fazer o benchmark ao final do projeto percebi que independente das minhas otimizações não conseguia ganhar mais performance, pesquisei e descobri outras pessoas com o mesmo problema, alterei as imagens bases para usar debian e tive um ganho de pelo menos 30% de performance.

### Testes
Para evitar que os testes façam requests nas APIs externas e fiquem lentos existe um mock do método responsável por buscar as informações de moedas da API. E nos testes desse método o acesso a API é feito para garantir a integração.

### Cache
Apliquei cache no acesso a APIs externas por 1 hora, acredito que esse tempo seja suficiente para garantir uma informação sempre atualizada e ao mesmo tempo proteger a API de lentidão de terceiros.

Também há cache de 1 hora ao buscar por uma moeda, esse cache foi para dar um pequeno ganho de performance na API evitando fazer algumas checagens de dados.

O mecanismo de cache escolhido foi o próprio Redis para reaproveitar esse ponto de infra-estrutura e facilitar a escalabilidade da API.

Não usei cache na rota de convert pois não valeria a pena cachear a variavel ammount, pois a variação dela é muito grande. Essa rota ganha cache da recuperação de moedas. Nas demais rotas não achei necessário aplicar cache por não ter uma lógica significativa.


## Especificações

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
