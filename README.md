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

## Convertendo valores

Após executar o comando do docker, o servidor já consegue receber requisições.

### Example

No terminal execute

    curl --location --request GET 'http://localhost:8080/v1/convert?from=BTC&to=EUR&amount=123.45'

Saída esperada

```json
{
	"status": "success",
	"data": {
		"result": 1984843.800252671
	}
}
```

## Running tests

### Requirements

* GoLang 1:15

### Command

    make tests

### Output

```bash
EMPTY .
PASS controller.TestController/convert_from_eur_to_brl (0.00s)
PASS controller.TestController/convert_from_invalid_currency (0.00s)
PASS controller.TestController (1.65s)
coverage: 87.5% of statements
PASS controller
PASS currency.TestCurrency/usd_currency (0.00s)
PASS currency.TestCurrency/eur_currency (0.00s)
PASS currency.TestCurrency/brl_currency (0.00s)
PASS currency.TestCurrency/btc_currency (0.00s)
PASS currency.TestCurrency/eth_currency (0.00s)
PASS currency.TestCurrency/cad_currency (0.00s)
PASS currency.TestCurrency/cad_lower_case_currency (0.00s)
PASS currency.TestCurrency/invalid_currency (0.00s)
PASS currency.TestCurrency (2.11s)
coverage: 70.0% of statements
PASS currency
PASS app.TestApp (1.89s)
coverage: 71.4% of statements
PASS app
EMPTY handlers

DONE 13 tests in 3.470s
```

## Informações a respeito do projeto

O desenvolvimento seguiu as práticas do TDD.

É utilizado duas API's externas para consultar o valor atual das cotações. As cotações são atualizadas no intervalo de um minuto.

Foi gerado executaveís para todas as plataformas, e se encontram dentro da pasta `bin`

A biblioteca utilizada para o servidor HTTP foi o [httping-go](https://github.com/ednailson/httping-go.git). É uma biblioteca escrita por mim, que utiliza o GIN como base.

Os padrões de resposta da API é o [JSend](https://github.com/omniti-labs/jsend)

# Contato

E-mail: evbcjr@gmail.com
LinkedIn: https://www.linkedin.com/in/ednailsonvb/