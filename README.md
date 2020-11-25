# Desafio HURB

Candidato: Ednailson Vilas Boas da Cunha Junior

LinkedIn: https://www.linkedin.com/in/ednailsonvb/

Recrutadora: Paloma

## Requirementos

* [Docker](https://docs.docker.com/engine/install/ubuntu/)

## Instalação

Após clonar o repositório, basta ir na raiz do projeto e executar o seguinte comando

    make docker-build

## Iniciando o projeto

Após criar a imagem de docker, basta rodar o comando 

    docker run -p 8080:8080 challenge-bravo run

O servidor HTTP está rodando localmente na porta `8080`
Por padrão a aplicação roda na porta `8080`, mas caso queira o acesso a partir de outra porta localmente, basta rodar o documento a seguir

    docker run -p 8080:PORTA_DESEJADA challenge-bravo run

## Endpoints

### Conversão

METÓDO `GET`

    /v1/convert?from=SIGLA_FROM&to=SIGLA_TO&amount=QTD

**Parametros**: 

* SIGLA_FROM: Sigla da moeda base
* SIGLA_TO: Sigla da moeda a ser convertida
* QTD: Quantidade a ser convertido

#### Exemplo

No terminal execute

    curl --location --request GET 'http://localhost:8080/v1/convert?from=BTC&to=EUR&amount=123.45'

Saída esperada

_Status http_: `200 OK`
```json
{
	"status": "success",
	"data": {
		"result": 1984843.800252671
	}
}
```

### Adicionando uma nova moeda 

METÓDO `POST`

    /v1/currency/SIGLA_DA_MOEDA

**Parametros**: 

* SIGLA_DA_MOEDA: Sigla da moeda a ser adicionada

#### Exemplo

No terminal execute

    curl --location --request POST 'http://localhost:8080/v1/currency/CAD'

Saída esperada

_Status http_: `200 OK`
```json
{
	"status": "success",
	"data": {
		"CAD": "CAD has been added"
	}
}
```

### Deletando suporte a moeda

METÓDO `DELETE`

    /v1/currency/SIGLA_DA_MOEDA

**Parametros**: 

* SIGLA_DA_MOEDA: Sigla da moeda a ser removida


#### Exemplo

No terminal execute

    curl --location --request DELETE 'http://localhost:8080/v1/currency/USD'

Saída esperada

_Status http_: `204 No Content`
```json
```

## Running tests

### Requirementos

* GoLang 1:15

### Comando

    make tests

### Output

```bash
EMPTY .
PASS controller.TestController/convert_from_eur_to_brl (0.00s)
PASS controller.TestController/convert_from_invalid_currency (0.00s)
PASS controller.TestController (1.10s)
coverage: 70.0% of statements
PASS controller
PASS currency.TestCurrency/usd_currency (0.00s)
PASS currency.TestCurrency/eur_currency (0.00s)
PASS currency.TestCurrency/brl_currency (0.00s)
PASS currency.TestCurrency/btc_currency (0.00s)
PASS currency.TestCurrency/eth_currency (0.00s)
PASS currency.TestCurrency/cad_currency (0.00s)
PASS currency.TestCurrency/usd_lower_case_currency (0.00s)
PASS currency.TestCurrency/adding_new_currency (0.00s)
PASS currency.TestCurrency/deleting_new_currency (0.00s)
PASS currency.TestCurrency (1.48s)
coverage: 77.4% of statements
PASS currency
PASS app.TestApp/converting_currencies (0.01s)
PASS app.TestApp/adding_cad_currency (0.00s)
PASS app.TestApp/deleting_cad_currency (0.00s)
PASS app.TestApp (1.50s)
coverage: 76.5% of statements
PASS app
EMPTY handlers

DONE 17 tests in 2.730s
```

## Benchmark

A aplicação chega a aguentar algo em torno de **3586** requisições no intervalo de **347661ns**.

## Informações a respeito do projeto

O desenvolvimento seguiu as práticas do TDD.

É utilizado duas API's externas para consultar o valor atual das cotações. As cotações são atualizadas no intervalo de um minuto.

Foi gerado executaveís para todas as plataformas, e se encontram dentro da pasta `bin`

A biblioteca utilizada para o servidor HTTP foi o [httping-go](https://github.com/ednailson/httping-go.git). É uma biblioteca escrita por mim, que utiliza o GIN como base.

Os padrões de resposta da API é o [JSend](https://github.com/omniti-labs/jsend)

# Contato

E-mail: evbcjr@gmail.com
LinkedIn: https://www.linkedin.com/in/ednailsonvb/