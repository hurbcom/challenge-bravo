# Hurb-Api Conversion

Api de conversão monetárias 

## Instalação
```bash
$ docker-compose up
```

```python
Autor: Rafael Soares de Souza
```

## Enunciado
Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API precisa converter entre as seguintes moedas:

USD
BRL
EUR
BTC
ETH
Outras moedas podem ser adicionadas conforme o uso.

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: ?from=BTC&to=EUR&amount=123.45

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

A API deve suportar conversão entre moedas fiduciárias, crypto e fictícias. Exemplo: BRL->HURB, HURB->ETH

"Moeda é o meio pelo qual são efetuadas as transações monetárias." (Wikipedia, 2021).

Sendo assim, é possível imaginar que novas moedas passem a existir ou deixem de existir, é possível também imaginar moedas fictícias como as de Dungeons & Dragons sendo utilizadas nestas transações, como por exemplo quanto vale uma Peça de Ouro (D&D) em Real ou quanto vale a GTA$ 1 em Real.

Vamos considerar a cotação da PSN onde GTA$ 1.250.000,00 custam R$ 83,50 claramente temos uma relação entre as moedas, logo é possível criar uma cotação. (Playstation Store, 2021).

Ref: Wikipedia [Site Institucional]. Disponível em: https://pt.wikipedia.org/wiki/Moeda. Acesso em: 28 abril 2021. Playstation Store [Loja Virtual]. Disponível em: https://store.playstation.com/pt-br/product/UP1004-CUSA00419_00-GTAVCASHPACK000D. Acesso em: 28 abril 2021.

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do Hurb temos mais afinidade:

JavaScript (NodeJS)
Python
Go
Ruby
C++
PHP
