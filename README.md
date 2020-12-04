# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Challenge Bravo

## Proposta

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

- USD
- BRL
- EUR
- BTC
- ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

## Solução

Esta API foi criada com o objetivo de armazenar as informações de moedas, contendo seus códigos e nomes, e também realizar a conversão entre as diferentes moedas que se encontram previamente cadastradas no banco de dados, utilizando uma API externa para isso: https://min-api.cryptocompare.com/documentation. As conversões utilizam como parâmetro os códigos de origem e destino, e também o montante que será convertido.

## Contato

Dicas, dúvidas e sugestões? Sinta-se a vontade para entrar em contato comigo!

Leonardo Meliande | leo.meliande25@outlook.com

:-)