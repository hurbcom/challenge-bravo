# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API realiza a conversão entre as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

A Aplicação foi construida utilizando Kotlin com Spring Boot

Para executar a api em um container docker basta ir ate a pasta do projeto e executar os seguintes comandos na sequencia abaixo:

$ ./gradlew build
$ ./gradlew bootJar
$ docker build -t currencyConverter
$ docker run -p 8095:8080 currencyConverter

Para facilitar a execução da API, também está disponibilizada uma imagem ja preparada no repositorio do docker Hub, bastando executar o código abaixo para baixar a imagem e executar em um container:

$ sudo docker run -p 8095:8080 felipebs86/fbs-currency-converter




