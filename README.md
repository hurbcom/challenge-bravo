
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

## Inicializar API

Esta API roda em DOCKER. Para levantar o container

```bash
docker-compose up -d --build
```

Instale as dependências

```bash
composer install
```

Crie um arquivo .env

```bash  
cp .env.example .env  
```

Por padrão no arquivo .env na variável `DB_DATABASE` o banco de dados recebe o nome de `api_conversao`, 
é necessário criar um banco de dados com o nome que está atribuído nesta variável de ambiente

Após criar o banco de dados rodar o comando 

```bash
php artisan migrate
```

A API estará rodando na endereço `http://localhost:8080`

Para executar os testes, rodar o comando:

```bash
vendor/bin/phpunit
```
  
## CRUD De Moedas

#### Lista todas as moedas

```http
GET /api/currency
```

#### Cria uma moeda

```http
POST /api/currency
```

| Body | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Obrigatório**. Nome da moeda |
| `lastro`      | `string` | **Opcional**. Lastro para referência de moedas fictícias |


#### Lista uma moeda

```http
GET /api/currency/{nome}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Obrigatório**. Nome da moeda |


#### Edita uma moeda

```http
PATCH /api/currency/{nome}
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
DELETE /api/currency/{nome}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `nome`      | `string` | **Obrigatório**. Nome da moeda |


## Conversão De Moedas

Converter valor de uma moeda para outra
```http
GET /api/currency/conversion?to=USD&from=BRL&amount=150.50
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
- MoedaTest em tests

