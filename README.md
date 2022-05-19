# Challenge Bravo
## _Code Challenge: API de Conversão de Moeda_

Challenge Bravo, é um "code challenge" oferecido pela Hurb como step de um processo seletivo de Engenharia de Software.

A aplicação API tem como responsabilidade fornecer uma calculadora de conversão de moedas.

## Stack

Challenge Bravo usa como tech stack:
- Golang
- Docker
- Docker Compose
- Make (opcional)

## Tech Decisions

As decisões técnicas utilizadas para o desenvolvimento da aplicação foram de criar uma aplicação que fosse facilmente compreendida, para isso utilizei uma linguagem altamente utilizada na atualidade (golang) e de fácil entendimento.
Além disso, utilizei algumas das boas práticas de clean code e as premissas do [Uber - Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md).
Utilizei um "scaffold" baseado em DDD para que o projeto possa evoluir futuramente, porém de forma bem "lite" pois trata-se de uma aplicação simples.

## Installation

A aplicação necessite de um ambiente com [Golang](https://go.dev/doc/install) 1.17+ para rodar.
Necessita também do [Docker](https://docs.docker.com/engine/install/ubuntu/) e do [Docker Compose](https://docs.docker.com/compose/install/)

Instale as dependências e para rodar a aplicação use o passo-a-passo abaixo:
(caso tenha o [Make](https://linuxhint.com/install-make-ubuntu/) instalado em sua máquina, pule para o exemplo com o Makefile)

### Passo 1:
Crie suas variáveis de ambiente de acordo com o que está no arquivo: `env/application.env`

### Passo 2:
Rode o comando:
```sh
docker-compose up
```

### Passo 3:
Em um novo terminal, rode o comando 
```sh
go run cmd/api/main.go
```

Agora basta seguir o tutorial de uso da API.

## Makefile

Uma alternativa para rodar, é usando o Makefile que encontra-se na raiz do projeto.

Em um terminal rode o comando:
```sh
make docker
```

Em um novo terminal, rode o comando:
```sh
make api
```

Agora basta seguir o tutorial de uso da API.

## Uso da API

# Métodos
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` | Retorna informações de uma ou mais moedas, e também usado para conversão. |
| `POST` | Utilizado para criar ou atualizar uma moeda. |
| `DELETE` | Remove uma moeda customizada. |

## Respostas

| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `400` | Dados enviados inválidos.|

## Conversão de Moedas
A ação de `converter` necessita do envio dos parâmetros:

| Parâmetro | Descrição |
|---|---|
| `from` | Moeda a ser utilizada como base de conversão. Ex.: USD |
| `to` | Moeda a ser utilizada para resultado de conversão. Ex.: BRL |
| `amount` | Valor total a ser convertido. Ex.: 100.50 |

| Método | Endpoint |
|---|---|
| `GET` | /currency/convert |

## Buscar uma Moeda customizada
A ação de `buscar` necessita do envio do parâmetro:

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | /currency/{id} | No `{id}` deve-se substituir pelo ID/nome da moeda customizada. Ex.: ABC |

## Listar as Moedas customizadas
A ação de `listar` não precisa enviar nenhum parâmetro, basta chamar o endpoint:

| Método | Endpoint |
|---|---|
| `GET` | /currency/custom |

## Criar Moeda customizada
A ação de `criar` necessita do envio dos parâmetros como `json` no `body` da request:

| Parâmetro | Descrição |
|---|---|
| `id` | Nome/ID da moeda a ser inserida/atualizada. Ex.: ABC |
| `usd_value` | Valor em dólar americana da moeda a ser inserida/atualizada. Ex.: 0.95 |

| Método | Endpoint |
|---|---|
| `POST` | /currency/ |

## Deletar Moeda customizada
A ação de `deletar` necessita do envio do parâmetro:

| Método | Endpoint | Descrição |
|---|---|---|
| `DELETE` | /currency/{id} | No `{id}` deve-se substituir pelo ID/nome da moeda customizada. Ex.: ABC |

## Notes

Por se tratar de uma linguagem em que não há uma "regra" de arquitetura, utilizei algumas premissas da comunidade e aderente à algumas boas práticas de mercado, nas quais venho aprimorando desde 2018 quando tive o primeiro contato com a linguagem em um monolito.

## License

MIT