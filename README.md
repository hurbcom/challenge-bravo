# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

# Conversor de moedas

Api construída em `GO` para conversão monetária.

A versão atual suporta a **listagem de moedas suportadas**, a **liberação de uma nova moeda para conversão**, a **conversão entre moedas** e a **atualização das taxas de câmbio**.



## Instalação

Para rodar a aplicação é necessário ter instalado uma vesão de `GO` superior a 1.10. 

Para o desenvolvimento do projeto foi utilizado a versão **1.13.4**.

A aplicação precisa ser clonada no diretório de trabalho setado ao instalar o GO.

  ```
  git clone https://github.com/Kaicham/challenge-bravo.git

  cd challenge-bravo

  go get 
  ```

## Rodando a aplicação

  ```
  go run main.go
  ```

## Bibliotecas externas
Para a criação da API foram utilizadas algumas bibliotecas extenas:

* [Echo labstack](https://echo.labstack.com/): framework web.
* [Cron](https://godoc.org/github.com/robfig/cron): biblioteca utilizada para rotinas automáticas.
* [enconding/json](https://godoc.org/encoding/json): biblioteca para manipulação de arquivos json.
* [ioutil](https://godoc.org/io/ioutil): biblioteca para leitura e escrita de arquivos.

# API Overview

## Conversão de moedas

Utiliza-se o método `GET` no endpoint `/exchange` para realizar a conversão das moedas. As moedas são indicadas nos parâmetros e a API retorna como resposta um json contendo o resultado da conversão e se a requisição foi realizada com sucesso.

## Parâmetros
 Os parâmetros para a requisição são passados via `QueryString`.

| parâmetro                    | descrição                 |
|:-----------------------------|:----------------------------|
| `from`                       | moeda base para a conversão (geralmente são 3 letras maiúsculas) `[OBRIGATÓRIO]` |
| `to`                         | moeda de destino (geralmente são 3 letras maiúsculas)`[OBRIGATÓRIO]`|
| `amount`                     | montante a ser convertido `[OBRIGATÓRIO]` |


  
`GET /exchange`

    http://{api_host}/exchange?from=USD&to=BRL&amount=3.0

### Resposta

  ```json
  {
    "success": true,
    "error": "",
    "data": {
      "last_update": "2019-12-03T22:00:00-03:00",
      "from": "USD",
      "to": "BRL",
      "amount": 3,
      "value": 12.616499999999998
    }
  }
  ```


| variável     | tipo               | descrição                 |
|:-------------|:---------------|:----------------------------|
| `success`    |booleano                   | Retorna se a requisição foi realizada com sucesso|
| `error`    |string                   | Retorna a mensagem de erro caso a `sucess` retorne `false`|
| `last_update`    |date                   | Retorna a data da última atualização das taxas|
| `from`    |string                   | Retorna a moeda de lastro|
| `to`    |string                   | Retorna a moeda de destino|
| `amount`    |double                   | Retorna a quantidade a ser convertida|
| `value`    |double                   | Retorna o valor convertido|


### Erro

  ```json
  {
    "success": false,
    "error": "mensagem de erro",
    "data": null
  }
  ```

## Listagem de moedas suportadas

Utiliza-se o método `GET` no endpoint `/suported-currencies` para se obter uma listagem completa das moedas que são suportadas pela API. Esse endpoint suporta o parâmetro `filter` recebendo como valor `unblocked`, para listar as moedas que a API converte atualmente, e `blocked`, para listar as moedas que podem ser liberadas através do endpoind `/add`. 

## Parâmetros
 Os parâmetros para a requisição são passados via `QueryString`.

| parâmetro                    | descrição                 |
|:-----------------------------|:----------------------------|
| `filter`                       | lista as moedas bloqueadas (`blocked`) e liberadas (`unblocked`) para a conversão. Retorna a listagem completa por default. [*OPCIONAL*] |


  
`GET /suported-currencies`

    http://{api_host}/suported-currencies?filter=unblocked

### Resposta

  ```json
  {
    "success": true,
    "error": "",
    "data": {
      "total": 5,
      "currencies": [
        "BTC",
        "EUR",
        "BRL",
        "USD",
        "ETH"
      ]
    }
  }
  ```

| variável     | tipo               | descrição                 |
|:-------------|:---------------|:----------------------------|
| `success`    |booleano                   | Retorna se a requisição foi realizada com sucesso|
| `error`    |string                   | Retorna a mensagem de erro caso a `success` retorne `false`|
| `total`    |inteiro                   | Retorna o total de moedas na listagem|
| `currencies`    |string array                   | Retorna a lista de moedas suportadas ou filtradas|

### Erro

  ```json
  {
    "success": false,
    "error": "mensagem de erro",
    "data": null
  }
  ```

## Adição de moedas

Utiliza-se o método `PUT` no endpoint `/add` para adicionar novas moedas a listagem de conversão. A moeda a ser adicionada é passada via `json` no body da requisição. Em caso de tentativa de adição de uma moeda inválida, a API retornará um erro. 

## Parâmetros
 Os parâmetros para a requisição são passados via `json` no body da requisição.

```json
{
	"currency": "DOP"
}
```
  
`PUT /add`

    http://{api_host}/add

### Resposta

  ```json
  {
    "success": true,
    "error": "",
    "data": "Moeda adicionada com sucesso!"
  }
  ```

| variável     | tipo               | descrição                 |
|:-------------|:---------------|:----------------------------|
| `success`    |booleano                   | Retorna se a requisição foi realizada com sucesso|
| `error`    |string                   | Retorna a mensagem de erro caso a `success` retorne `false`|
| `data`    |string                   | Retorna mensagem de sucesso da adição|

### Erro

  ```json
  {
    "success": false,
    "error": "mensagem de erro",
    "data": null
  }
  ```

  ## Atualização de taxas

Utiliza-se o método `PUT` no endpoint `/update` para atualizar os arquivos contendo as taxas de câmbio das moedas. Existe um serviço automático para a atualização das taxas que é executado das `9h as 17h` de `segunda à sexta` no intervalo de `1 em 1 hora`. Para mais informações consultar **notas finais**.

`PUT /update`

    http://{api_host}/update

### Resposta

  ```json
  {
    "success": true,
    "error": "",
    "data": "Taxas atualizadas com sucesso!"
  }
  ```

| variável     | tipo               | descrição                 |
|:-------------|:---------------|:----------------------------|
| `success`    |booleano                   | Retorna se a requisição foi realizada com sucesso|
| `error`    |string                   | Retorna a mensagem de erro caso a `success` retorne `false`|
| `data`    |string                   | Retorna mensagem de sucesso da atualização|

### Erro

  ```json
  {
    "success": false,
    "error": "mensagem de erro",
    "data": null
  }
  ```

---

# Notas Finais

## Persistência de dados
A API utiliza arquivos `.json` para controlar as taxas e as moedas suportadas. O arquivo `currencies.json` carrega as taxas de câmbio das moedas. O arquivo `suportedCurrencies.json` carrega o estado das moedas suportadas (se estão liberadas para conversão ou não). Para posteriores versões, o controle desses estados e taxas serão integrados com um banco de dados.

## Atualização automática das taxas 
A API utiliza um serviço de atualização de taxas de câmbio automático. O serviço é executado de segunda à sexta, das 9h as 17h. O horário foi escolhido de acordo com a abertura / fechamento do mercado de câmbio e limitada de 50 em 50 minutos para o melhor uso dos créditos dispostos pela API (limite de 200 requisições para chave gratuita). API utilizada para obtenção das taxas [openexchangerates.org]("https://openexchangerates.org).

## Configurações da aplicação
O projeto conta com uma pasta de configurações globais da aplicação (/config). Nesta pasta, o arquivo `config.json` carrega a **porta** do servidor da aplicação, a **chave da API externa** e a **URL da API externa**. Para o processo de deploy, orienta-se copiar essa pasta para dentro do container junto com o artefato gerado pelo build. Dessa forma, toda vez que as configurações globais forem modificadas não será necessário **buildar** a aplicação novamente com as novas configurações. Somente será necessário reiniciar o container. Isso pode ser aplicado também para a diferenciação de ambientes de *homologação* e *produção*.

---


