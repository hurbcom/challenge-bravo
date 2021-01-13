# Desafio Challenge Bravo

Candidato: Vinicius da Silva Cardozo

LinkedIn: https://www.linkedin.com/in/vinicius-cardozo-669a15136/

Recrutadoras: Paloma Andrade e Beatriz Cristine

## Requesitos

* [Docker-compose](https://docs.docker.com/compose/install/)

## Setup

Após clonar o repositório, é necessário ir no caminho raiz e rodar o seguinte comando 

    docker-compose up

Isso subirá a API na porta `8082`

## Rotas

### Adicionar uma nova moeda

METÓDO `POST`v1/

    /v1/addCurrency
    
#### Exemplo

No terminal execute

    curl --location --request POST 'http://localhost:8082/v1/addCurrency' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "initials": "AUD", 
      }'

Ou em alguma outra interface preferência, tipo Postman ou Insomnia por exemplo

**Body** (application/json):

    {
	    "initials": "AUD"
    }

Saída esperada

_Status http_: `200 OK`
```json
{
  "status": "Created",
  "data": {
    "initials": "AUD"
  }
}
```

### Converter moedas

METÓDO `GET`

    /v1/currencyConvert

**Parametros**: 

* From: Sigla da moeda base
* To: Sigla da moeda para ser convertida
* Amount: Quantidade a ser convertida   

#### Exemplo

No terminal execute

    curl --location --request GET 'http://localhost:8082/v1/currencyConvert?from=USD&to=BRL&amount=70'

Ou em alguma outra interface preferência, tipo Postman ou Insomnia por exemplo

Saída esperada

_Status http_: `200 OK`
```json
{
  "status": "success",
  "data": {
    "From": "USD",
    "To": "BRL",
    "Amount": 70,
    "Value": 383.074899284
  }
}
```

### Deletar uma moeda

METÓDO `DELETE`v1/

    /v1/deleteCurrency/:currency

**Parametros**: 

* currency: Sigla da moeda a ser deletada
    
#### Exemplo

No terminal execute

    curl --location --request DELETE 'http://localhost:8082/v1/deleteCurrency/AUD' 

Ou em alguma outra interface de sua preferência, tipo Postman ou Insomnia por exemplo

Saída esperada

_Status http_: `200 OK`
```json
{
  "status": "success"
}
```

### Verificar todas moedas presentes na aplicação

METÓDO `GET`v1/

    /v1/getCurrencies
   
#### Exemplo

No terminal execute

    curl --location --request GET 'http://localhost:8082/v1/getCurrencies' 

Ou em alguma outra interface de sua preferência, tipo Postman ou Insomnia por exemplo

Saída esperada

_Status http_: `200 OK`
```json
{
  "AUD": 1.2976239415,
  "BRL": 5.4724985612,
  "BTC": 0.00002886,
  "ETH": 0.0009379,
  "EUR": 0.8221655841,
  "USD": 1
}
```

## Executar os testes
### Requesitos

* Golang 1:15

Para executar os testes feitos é necessario entrar na pasta ./api do projeto e rodar o comando:

  `make run-tests` 

A saída esperada será a seguinte: 

    
      go test -race -coverpkg= ./... -coverprofile=./test/cover/cover.out
      ?       challenge-bravo/api     [no test files]
      ?       challenge-bravo/api/app [no test files]
      ok      challenge-bravo/api/controller  3.239s  coverage: 62.5% of statements
      ok      challenge-bravo/api/currency    3.212s  coverage: 62.2% of statements
      ok      challenge-bravo/api/currency/currency_updater   1.597s  coverage: 75.0% of statements
      ?       challenge-bravo/api/handlers/addCurrency        [no test files]
      ?       challenge-bravo/api/handlers/convert    [no test files]
      ?       challenge-bravo/api/handlers/deleteCurrency     [no test files]
      ?       challenge-bravo/api/handlers/getCurrencies      [no test files] 