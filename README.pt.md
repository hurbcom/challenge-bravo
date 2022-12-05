# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Desafio Bravo

[[English](README.md) | [Português](README.pt.md)]

 A API para conversão de moedas foi desenvolvida em linguagem Golang tem como objetivo capturar a cotação atual das moedas e realizar a conversão para as moedas cadastradas.

 A API converte entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH
-   PSN (moeda Virtual da Play station Network)
-   XBX (moeda Virtual da Xbox)

Caso o usuário queira cadastrar novas moedas, é possivel realizar uma requisição HTTP com o corpo da requisição do formato JSON do exemplo abaixo:

{
    "code": "XBX",  
    "name": "Xbox Coins",
    "tousd": "1,50",
    "type": "FIC"
}

onde: 
code = Codigo da moeda
name = nome da moeda
tousd = fator de conversão da moeda para Dólar (lastro)
type = tipo de moeda (fisica (PHY) para moedas como dolar, real brasileiro e etc, virtual (VIR) para criptomoedas e ficticia (FIC) para moedas utilizadas em plataforma de jogos e que necessitam de conversão para comprá-las )

para o armazenamento das moedas no banco de dados, foi criada a seguinte estrutura utilizando o mysql
 
CREATE TABLE `currency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `tousd` varchar(50) NOT NULL,
  `type` varchar(3) NOT NULL,
  `create_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code_UNIQUE` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


para realizar o CRUD da moeda e necessário realizar as requisições nos seguintes caminhos

POST: localhost:8000/currency
PUT: localhost:8000/currency/:id
GET: localhost:8000/currency/:id
DELETE: localhost:8000/currency/:id
GET: localhost:8000/currency/

para cada caminho temos as seguintes Status-Code

200 - para os casos de conclusao da requisição com sucesso
204 - para os casos de deleção con sucesso
400 - pra os casos de requisição inadequada (valores fora do padrão)
404 - para os casos de recurso (entidade) não encontrado
500 - para erros internos como os de acesso a banco de dados

para a requisição da conversão da moeda, deve-se realizar uma requisição HTTP para o seguinte caminho

GET localhost:8000/quotation/?from=PSN&to=BRL&amount=10

onde:
from = moeda inicial
to = moeda de destino da conversão
amount = valor de conversão.

no caso, pode-se ler ?from=PSN&to=BRL&amount=10 como:
converter da moeda "from" para a moeda "to" o valor de "amount"

Como exemplo, temos o caso da seguinte requisição HTTP

GET localhost:8000/quotation/?from=PSN&to=BRL&amount=10

como resultado, teremos a seguinte resposta no formato JSON:

{
    "code": "Play Station Coins",
    "codein": "Brazilian-Real",
    "name": "Play Station Coins/Brazilian-Real",
    "bid": "65.685759",
    "create_date": "2022-12-05 13:12:19"
}

## Pontos de Vulnerabilidade

- A API, para realizar a conversão, requisita de uma api publica para coletar os valores atualizados das cotações, contudo, o body de resposta desta API publica resulta no campo de conversão em string, o que dificulta na precisão dos parametros de conversão de moedas.
A documentação da API de conversão de moedas se encontra em:

https://docs.awesomeapi.com.br/api-de-moedas

As issues relatando os erros de formato da cotação se encontram em:

https://github.com/raniellyferreira/economy-api/issues

- No crud das moedas, o campo "tousd", por ser uma string, aceita outros tipos de separadores que não o ponto ".". Por mais que se tenha validação deste campo, o usuário pode informar um valor que não é o esperado e nao ser realizada a conversão da cota corretamente

## Points of Vulnerability

- The API, to carry out the conversion, requests a public api to collect the updated quote values, however, the response body of this public API results in the conversion field in string, which makes it difficult to accurately convert currency parameters .
Documentation for the Currency Conversion API can be found at:

https://docs.awesomeapi.com.br/api-de-moedas

Issues reporting quote format errors can be found at:

https://github.com/raniallyferreira/economy-api/issues

- In the crud of coins, the "tousd" field, as it is a string, accepts other types of separators than the dot ".". As much as this field is validated, the user can enter a value that is not expected and the quota conversion will not be carried out correctly

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
