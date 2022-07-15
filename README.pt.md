# Challenge Bravo

<img alt="Hurb's logo" width=150 height=150 src="https://www.freelogovectors.net/wp-content/uploads/2022/01/hurb-logo-freelogovectors.net_.png">

[[English](README.md) | [Portuguese](README.pt.md)]

Challenge Bravo é um code challenge da HURB. O objetivo é criar uma REST API capaz de converter moedas. A API deve utilizar valores reais nas conversões. Mas, ela também dever ser capaz de converter moedas fictícias.

## O que você precisa
- Go 1.18+
- PostgreSQL (ou docker + docker compose)
- Uma [chave da abstract API](https://www.abstractapi.com/api/exchange-rate-api)

## Informações adicionais
Esse sistema tenta usar strings e ints para as moedas o máximo possível para não perder precisão, já que números de ponto flutuante não devem ser utilizados para operações aritméticas em dinheiro.<br>
Com isso em mente, o endpoint `convert` retorna o resultado como uma string, ao invés de um número.<br>

Após o sistema estar rodando, você poderá visualizar a documentação para a API através de `http://localhost:PORT/docs`. (a porta padrão é 8080)<br>

Como go não tem uma estrutura de projeto padrão, eu segui boas práticas da comunidade assim como as diretrizes do [effective go](https://go.dev/doc/effective_go), e também criei essa estrutura pensando em escalabilidade e manutenibilidade.

## Endpoints:
1. `/docs` - `GET` - documentação da API.
2. `/api/v0/status` - `GET` - status da API.
3. `/api/v0/currencies` - `POST` - Cria uma moeda.
4. `/api/v0/currencies/{currency_code}` - `GET` - Retorna uma moeda.
5. `/api/v0/currencies/{currency_code}` - `PATCH` - Atualiza uma moeda.
6. `/api/v0/currencies/{currency_code}` - `DELETE` - Remove uma moeda.
7. `/api/v0/currencies/convert` - `GET` - Converte um valor entre duas moedas.

## Como rodar
### 1:
Crie suas variáveis de ambiente. Ou, se preferir, adicione-as ao arquivo .env na pasta `./cmd/env`.

### Com PostgreSQL puro
### 2:
Crie um novo banco usando os mesmos valores que você utilizou nas suas variáveis de ambiente e inicie o PostgreSQL.

### Com docker e docker compose
Se você estiver usando docker, você deverá usar variáveis de ambiente, já que o docker compose não pegará as Informações do arquivo .env.
### 2.1:
Vá para a pasta `./docker` e rode o seguinte comando
```sh
docker-compose up
```

### 2.2:
Depois rode
```sh
docker start postgresql_challenge_bravo
```
para iniciar o banco de dados.

### 3:
Vá para a pasta `./cmd` e rode
```sh
go run . -envfile -execds
```

A flag `-envfile` é usada para iniciar o programa usando o arquivo .env. Omitindo-a, ao invés do arquivo, o sistema usará variáveis de ambiente.<br>
A flag `-execds` irá executar o [schema padrão](https://github.com/Pedro-Pessoa/challenge-bravo/blob/main/cmd/default_schema.go). É recomendável sempre passar essa flag, e é necessário passá-la a primeira vez que o sistema for iniciado, já que o banco será setado. As cinco moedas padrão (USD, BRL, EUR, BTC, ETH) também serão adicionadas ao banco.<br>

É isso. Agora você já pode usar a API. Para ver a documentação acesse: `http://localhost:PORT/docs`.

## Boilerplate
Duas bibliotecas que geram boilerplate foram utilizadas: [easyjson](https://github.com/mailru/easyjson) e [swaggo](https://github.com/swaggo/swag).<br>

Easyjson está sendo usada para marshal e unmarshal a [struct currency](https://github.com/Pedro-Pessoa/challenge-bravo/blob/main/pkg/monetary/currency.go). A razão por trás dessa decisão é para agilizar os HTTP requests, já que o pacote json da stdlib não é muito rápido. E essa API precisar ser capaz de aguentar 1000 requests por segundo. O único boilerplate criado por essa bibiloteca é o arquivo [monetary_easyjson.go](https://github.com/Pedro-Pessoa/challenge-bravo/blob/main/pkg/monetary/monetary_easyjson.go).<br>

Swaggo foi utilizado para criar a documentação da API. A razão por trás dessa decisão foi escalabilidade. Nós podemos adicionar quantos endpoints forem necessários e documentá-los facilmente apenas escrevendo comentários no código. Todo o boilerplate criado por essa biblioteca está na pasta [docs](https://github.com/Pedro-Pessoa/challenge-bravo/tree/main/staticfiles/docs).

## Contribuindo
Para contribuir a esse projeto, você precisará instalar dois binários: [easyjson](https://github.com/mailru/easyjson) e [swaggo](https://github.com/swaggo/swag).<br>

Você irá encontrar instruções para instalá-los nos respectivos README's.<br>

OBS: esses passos não são necessários para rodar a API, apenas para desenvolve-lá.<br>

Rode
```sh
easyjson .
```
na pasta `./pkg/monetary` se você fizer qualquer alteração na struct Currency.<br>
Certifique-se de atualizar o schema do banco de dados também.<br><br>

Para gerar a documentação, rode
```sh
swag init -o ../staticfiles/docs --parseDependency
```
dentro da pasta `./cmd`.