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

## API

A API foi desenvolvida em Python, utilizando o framework Flask. Por se tratar de um framework simples não foi gerado nenhum *boilerplate code*. O banco de dados da aplicação é o SQLite.

Escolhi utilizar essa ferramenta para aprimorar o conhecimento em Python e no uso do Flask.

Para realizar as consultas das cotações das moedas foi utilizada a API gratuita [_CoinCap_](https://docs.coincap.io/?version=latest).

É possível executar a aplicação utilizando um ambiente virtual ou container.

### Ambiente virtual

Acesse a pasta do repositório e digite os seguintes comandos. Se você já tem o virtualenv instalado pode pular o primeiro comando.

```
sudo pip install virtualenv
virtualenv env
source env/bin/activate
pip install -r requirements.txt
cd project
python app.py
```
Feito isso, a API estará rodando no endereço http://0.0.0.0:5000.

### Container

Para rodar a aplicação em um container é necessário ter o Docker instalado e executar o seguinte comando:

```
docker run -d -p 5000:5000 laryssacarvalho/docker_flask:latest
```
Feito isso, a API estará rodando no endereço http://0.0.0.0:5000.

### Endpoints

#### POST /api/currency 

Insere uma nova moeda. 

| Parâmetro | Descrição                                   |
| --------- |:-------------------------------------------:|
| code      | **(Obrigatório)** Código ISO 4217 da moeda. |

**Exemplo de requisição**

```
curl -d '{"code":"BTC"}' -H "Content-Type: application/json" -X POST http://0.0.0.0:5000/api/currency
```

**Exemplo de resposta**

```
{
    "success": true,
    "message": 'Registro adicionado com sucesso.'  
}
```

| Parâmetro | Descrição                               |
| --------- |:---------------------------------------:|
| success   | Indica se ocorreu um erro na requisição |
| message   | Mensagem com a descrição do retorno     |

*As requisições para deletar e converter moeda também retornam esses parâmetros.*

#### GET /api/currency

Consulta todas as moedas cadastradas no banco.

**Exemplo de requisição**

```
curl http://0.0.0.0:5000/api/currency
```

**Exemplo de resposta**

```
[
    {
        "id": 1,
        "code": 'USD'  
    },
    {
        "id": 2,
        "code": 'BRL'  
    }
]
```

#### GET /api/currency/{currency_id}

Consulta os dados de uma moeda pelo ID. 

| Parâmetro    | Descrição                      |
| ------------ |:------------------------------:|
| currency_id  | **(Obrigatório)** ID da moeda |

**Exemplo de requisição**

```
curl http://0.0.0.0:5000/api/currency/1
```

**Exemplo de resposta**

```
{
    "id": 1,
    "code": 'USD'  
}
```

#### DELETE /api/currency/{currency_id}

Excluí uma moeda. 

| Parâmetro   | Descrição                                     |
| ----------- |:---------------------------------------------:|
| currency_id | **(Obrigatório)** ID da moeda a ser excluída |

**Exemplo de requisição**

```
curl -X DELETE http://0.0.0.0:5000/api/currency/1
```

**Exemplo de resposta**

```
{
    "success": true,
    "message": 'Registro excluído com sucesso.'  
}
```

#### GET /api?from=CURRENCY_ISO&to=CURRENCY_ISO&amount=VALUE

Converte um valor de uma moeda para outra. 

| Parâmetro | Descrição                                       |
| ----------|:-----------------------------------------------:|
| from      | **(Obrigatório)** Código ISO da moeda de origem.|
| to        | **(Obrigatório)** Código ISO da moeda destino.  |
| amount    | **(Obrigatório)** Quantia a ser convertida.     |

**Exemplo de requisição**

```
curl http://0.0.0.0:5000/api?from=USD&to=BRL&amount=123.45
```

**Exemplo de resposta**

```
{
    "success": true,
    "amount": 507.07
}
```
