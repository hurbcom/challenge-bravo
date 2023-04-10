# Resolução desafio Bravo 

## Descrição

API REST para conversão monetária entre moedas fiduciárias, crypto e fictícias. Para a execução do cálculo de cotação foi utilizada uma moeda de lastro que pode ser definida via arquivo .env.

O projeto foi desenvolvido utilizado o framework NestJs. Os principais arquivos com a lógica do negócio estão contidos na pasta `/src/modules/currency`.

Nenhum teste em animais foi realizado durante o desenvolvimento do projeto.
## Setup do projeto
#### Clone o reposítorio para sua máquina local e crei o arquivo .env
```bash
$ git clone git@github.com:jeffersonalexandro/challenge-bravo.git
$ cd ./challenge-bravo 
$ cp .env.sample .env
```

#### Inicialização do projeto
```bash
$ docker-compose up
```


## Acessar API
#### Para acessar a API utilize a URL:
```bash
http://0.0.0.0:3000
```

#### Swagger autogerado:
```bash
http://0.0.0.0:3000/docs
```


## Documentação da API

### Calcular cotação

`GET /currencies/?from={code}&to={code}&amount={amount}`

| Parâmetro query  | Tipo       | Descrição                                   | Obrigatório | 
| :---------- | :--------- | :------------------------------------------ | :------------------------------------------ |
| `from` | `string` | Moeda base. Indica em qual moeda o valor informado para cálculo encontra-se | Sim |
| `to` | `string` | Moeda alvo. Define a moeda de saída do resultado do cálculo | Sim |
| `amount` | `number` | Valor total que será convertido | Sim |

#### Exemplo de requisição e resposta
```curl
curl --request GET \
  --url 'http://0.0.0.0:3000/currencies?from=USD&to=BRL&amount=83'
```
```javascript
{
	"info": {
		"exchangeRate": 5.0595,
		"lastUpdate": "2023-04-09 22:47:39"
	},
	"result": 419.9385
}
```

### Criar uma moeda fictícia

`POST /currencies/`

| Parâmetro body  | Tipo       | Descrição                                   | Obrigatório                             | 
| :---------- | :--------- | :------------------------------------------ | :------------------------------------------ |
| `name`      | `string` | Nome da moeda que será criada | Sim |
| `code`      | `string` | Código da moeda que será criada | Sim |
| `baseCode`      | `string` | Código da moeda base | Sim |
| `amount`      | `number` | Valor que referencia o código informado em `code`, utilizado para cálculo da cotação | Não |
| `baseAmount`      | `number` | Valor que referencia o código informado em `baseCode`, utilizado para cálculo da cotação  | Não |
| `quotation`      | `number` | Valor calculado da cotação entre `code` e `baseCode` | Sim* |

* Campo `quotation` é obrigatório para casos onde os campos `amount` e `baseAmount` não forem informados.

#### Exemplo de requisição e resposta
Requisição usando `amount` e `baseAmount`
```curl
curl --request POST \
  --url http://0.0.0.0:3000/currencies \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "PSN Coin",
	"code": "PSN",
	"baseCode": "BRL",
	"amount": 1250000,
	"baseAmount": 83.5
}
```
Requisição usando `quotation`
```curl
curl --request POST \
  --url http://0.0.0.0:3000/currencies \
  --header 'Content-Type: application/json' \
  --data '{
	"name": "PSN Coin",
	"code": "PSN",
	"baseCode": "BRL",
	"quotation": 14970.0598802395
}
```

Resposta para ambos os cenários
```javascript
{
	"code": "PSN",
	"name": "PSN Coin",
	"exchangeRate": "74844.67455621302",
	"type": "FICTICIUS",
	"lastUpdate": "2023-04-09 22:00:04"
}
```

### Desabilitar uma moeda

`DELETE /currencies/{code}`

| Parâmetro url   | Tipo       | Descrição                                   | Obrigatório | 
| :---------- | :--------- | :------------------------------------------ | :------------------------------------------ |
| `code` | `string` | Código da moeda que será desabilitada | Sim |

#### Exemplo de requisição
```curl
curl --request DELETE \
  --url http://0.0.0.0:3000/currencies/HURB
```
## Variáveis de ambiente

**SUPPORT_CODE**: Moeda utilizada como base para cálculos de cotação, onde todas as cotação serão armazenadas em paridade com a moeda definida.

**REFETCH_TIME_IN_SECONDS** - Tempo em segundos para que as moedas armazenadas sejam definidas como desatualizadas e uma nova sincronização com a API externa seja realizada.
