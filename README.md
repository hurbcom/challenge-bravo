
# API-CONVERSAO

A API realiza conversão de moedas se baseando na cotação do dia. 
A cotação é buscada na api pública https://github.com/fawazahmed0/currency-api

A API permite fazer CRUD de moedas, podendo registrar moedas fictícias atribuindo a elas 
a referência de uma moeda existente como lastro. 
## Tecnologias Utilizadas

- **PHP** 
- **MYSQL** 
- **LUMEN** 
- **DOCKER**
  
## Variáveis de Ambiente

Esta API roda em DOCKER. É recomendado ter um banco de dados chamado `api_conversao`
pois ao levantar o container as tabelas já serão criadas neste banco de dados.

Porém é possível customizar, para isso insira o nome do banco de dados na variável
`DB_DATABASE` no arquivo .env

Após inicializar a API rode o comando: `docker-compose exec php php artisan migrate`

  
## Inicializar API

```bash
  composer install
  docker-compose up -d --build
```

A API estará rodando na URL `http://localhost:8080`

  
## CRUD De Moedas

#### Lista todas as moedas

```http
GET /api/moedas
```

#### Cria uma moeda

```http
POST /api/moedas
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Obrigatório**. Nome da moeda |
| `lastro`      | `string` | **Opcional**. Lastro para referência de moedas fictícias |


#### Lista uma moeda

```http
GET /api/moedas/{nome}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Obrigatório**. Nome da moeda |


#### Edita uma moeda

```http
PATCH /api/moedas/{nome}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Obrigatório**. Nome da moeda |

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Opcional**. Nome da moeda |
| `lastro`      | `string` | **Opcional**. Lastro para referência de moedas fictícias |


#### Remove uma moeda

```http
DELETE /api/moedas/{nome}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Obrigatório**. Nome da moeda |


## Conversão De Moedas

Converter valor de uma moeda para outra
```http
GET /api/moedas?to=USD&from=BRL&amount=150.50
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `to`      | `string` | **Obrigatório**. Moeda de origem |
| `from`      | `string` | **Obrigatório**. Moeda para o valor convertido |
| `amount`      | `float` | **Obrigatório**. Valor a ser convertido |


## Autoria

Como foi utilizado o micro-framework LUMEN, essa é a listagens de arquivos que 
são de minha autoria:
- Arquivos do Docker
- Classes de Repositories
- Classes de Requests
- Classes BaseController, MoedaController de Controllers
- Classe MoedaService de Service
- Trait UuidTrait em Models/Traits

Apesar de alguns arquivos fazer parte da estrutura do framework o código neles inseridos
também são de minha autoria como:
- Moeda em Models
- Rotas em Routes
- Arquivos de migrations em database/migrations

