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

# Documentação

A API foi desenvolvida em NodeJS, utilizando o banco de dados MongoDB e, para executar o teste de stress, a ferramenta Artillery.

Para realizar a conversão das moedas, as cotações foram consultadas na API da [_CoinCap_](https://docs.coincap.io/?version=latest).

## Instalação

- Acessar a pasta do projeto
- Instalar a ferramenta Artillery para o teste de stress: `npm install -g artillery`
- Realizar o build do container: `docker-compose build`
- Executar a aplicação: `npm start`

O endereço da API será http://localhost:3000.

## Testes

- Para executar o teste de stress com um volume de 1000 requisições, é necessário executar o comando `npm test`.

## Endpoints

### GET /currency
- Retorna todas as moedas cadastradas
- Retorno da requisição
```
{
    "status": true,
    "response": [
        {
            "_id": "5dadbd94e63c09001945c7d0",
            "name": "USD",
            "__v": 0
        },
        {
            "_id": "5dadbd8ae63c09001945c7cf",
            "name": "BRL",
            "__v": 0
        },
        {
            "_id": "5dadbda8e63c09001945c7d3",
            "name": "BTC",
            "__v": 0
        }
    ]
}
```

### GET /currency/{currency_symbol}
- Retorna uma moeda cadastrada
- Retorno de requisição
```
{
    "status": true,
    "response": [
        {
            "_id": "5dadbda8e63c09001945c7d3",
            "name": "BTC",
            "__v": 0
        }
    ]
}
```

### POST /currency
- Realiza o cadastro de uma moeda
- Exemplo de requisição
```
{
	"name": "BTC"
}
```
- Retorno da requisição
```
{
    "status": true,
    "response": "Currency successfully registered"
}
```

### DELETE /currency/{currency_symbol}
- Remove uma moeda cadastrada anteriormente
- Retorno da requisição
```
{
    "status": true,
    "response": "Currency successfully removed"
}
```

### GET /convert?from={currency_symbol}&to={currency_symbol}&amount={value}
- Realiza a conversão de um valor de uma moeda para outra
- Requisição
```
http://localhost:3000/convert?from=BTC&to=BRL&amount=10
```
- Retorno da requisição
```
{
    "status": true,
    "response": {
        "from": "BTC",
        "to": "BRL",
        "amount": "10",
        "value": 340774.95712505426
    }
}
```