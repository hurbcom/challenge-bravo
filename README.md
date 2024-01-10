# <img src="https://avatars1.githubcurrencycontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

[[English](README.md) | [Português](README.pt.md)]

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com **cotações de verdade e atuais**.

A API precisa converter entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Outras moedas podem ser adicionadas conforme o uso.

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

A API deve suportar conversão entre moedas fiduciárias, crypto e fictícias. Exemplo: BRL->HURB, HURB->ETH

"Moeda é o meio pelo qual são efetuadas as transações monetárias." (Wikipedia, 2021).

Sendo assim, é possível imaginar que novas moedas passem a existir ou deixem de existir, é possível também imaginar moedas fictícias como as de Dungeons & Dragons sendo utilizadas nestas transações, como por exemplo quanto vale uma Peça de Ouro (D&D) em Real ou quanto vale a GTA$ 1 em Real.

Vamos considerar a cotação da PSN onde GTA$ 1.250.000,00 custam R$ 83,50 claramente temos uma relação entre as moedas, logo é possível criar uma cotação. (Playstation Store, 2021).

Ref:
Wikipedia [Site Institucional]. Disponível em: <https://pt.wikipedia.org/wiki/Moeda>. Acesso em: 28 abril 2021.
Playstation Store [Loja Virtual]. Disponível em: <https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D>. Acesso em: 28 abril 2021.

## A API foi implementada com Typescript, mongoDB, redis.

## Api externa utilizada para a cotação

```
https://economia.awesomeapi.com.br

```

## Instalação

-   Para executar o código rodar os seguintes comandos:
    -   git clone https://github.com/luizmarques/challenge-bravo.git
    -   cd challenge-bravo
    -   docker-compose up --build
-   Isso irá subir os containers necessários, já configurados com variáveis de ambiente.
	- O acesso estará na porta ``http://localhost:3003``, siga as rotas abaixo:


## Rotas
**Converter moedas**  

Recebe três query parametros: ``from``, ``to`` e ``amount``

``GET /currencies/convert?from={from}&to={to}&amount={amount}``

Retornará o seguinte objeto:

```
{
	"from": "USD",
	"to": "BTC",
	"bid": 0.00002186791645073342,
	"ballast": "USD",
	"amountFrom": "20",
	"resultTo": 0.00043735832901466837,
	"retrieveDate": "2024-01-02T03:54:54.973Z"
}

```

**Listar moedas cadastradas**

``GET /currencies/all``

Retornará uma lista de moedas cadastradas:

```
[
	{
		"_id": "659385c16cfa8ec809397289",
		"name": "EUR",
		"code": "EUR",
		"codein": "EUR",
		"bid": 1,
		"isFictitious": false,
		"createdAt": "2024-01-02T03:40:49.088Z",
		"updatedAt": "2024-01-02T03:40:49.088Z",
		"__v": 0
	},
	{
		"_id": "659389576cfa8ec809397294",
		"name": "American Dollar",
		"code": "USD",
		"codein": "USD",
		"bid": 1,
		"isFictitious": false,
		"createdAt": "2024-01-02T03:56:07.149Z",
		"updatedAt": "2024-01-02T03:56:07.149Z",
		"__v": 0
	}
]
```

**Cadastrar moeda**

``POST /currencies/currency``

Recebe um JSON com as propriedades:
```
{
	"name": "American Dollar",
	"code": "USD",
	"codein": "USD",
	"bid": 1,
	"isFictitious": false
}
```

**Atualizar moeda**

``PUT /currencies/currency``

Recebe um JSON com as propriedades:
```
{
	"name": "American Dollar",
	"code": "USD",
	"codein": "USD",
	"bid": 1,
	"isFictitious": false
}
```

**Busca a cotação atual de todas moedas que estão cadastradas na API externa**

``GET /currencies/api``

Retornará um objeto de moedas cadastradas:
```
{
	"EURBRL": {
		"code": "EUR",
		"codein": "BRL",
		"name": "Euro/Real Brasileiro",
		"high": "5.3747",
		"low": "5.3747",
		"varBid": "0",
		"pctChange": "0",
		"bid": "5.3497",
		"ask": "5.3997",
		"timestamp": "1704167977",
		"created_at": "2024-01-02 00:59:37"
	},
	"USDBRL": {
		"code": "USD",
		"codein": "BRL",
		"name": "Dólar Americano/Real Brasileiro",
		"high": "4.8534",
		"low": "4.8534",
		"varBid": "0",
		"pctChange": "0",
		"bid": "4.8526",
		"ask": "4.8541",
		"timestamp": "1704146403",
		"created_at": "2024-01-01 19:00:03"
	}
}
```

**Busca a cotação atual de uma unica moeda na API externa**

``GET /currencies/api/currency/:code``

Retornará um objeto com a  moedas cadastrada:
```
{
	"code": "BTC",
	"codein": "BRL",
	"name": "Bitcoin/Real Brasileiro",
	"high": "221988",
	"low": "208852",
	"varBid": "11456",
	"pctChange": "5.45",
	"bid": "221582",
	"ask": "221582",
	"timestamp": "1704165365",
	"created_at": "2024-01-02 00:16:05"
}
```

**Remover moeda**

``DELETE /currencies/:code``

Remove a moeda com o ID informado.

**Considerações e melhorias**

```

Algumas melhorias para api:

- Criar um banco de dados em memória para que o cache não fique sem receber requisições enquanto atualiza.
- Acesso ao cache, com o redis se transformar em um micro serviço.
- Utilizar mensageria para comunicação entre os serviços.
- Refatoração do código.

```

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
