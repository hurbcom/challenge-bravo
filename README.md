# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve converter entre as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

# API

## Como iniciar

### Instalando depedências e rodando o Servidor
```
$ git clone https://github.com/mouraggui/challenge-bravo.git
$ cd challenge-bravo
$ npm install
$ npm start
``` 

### Acessando API

```
http://localhost:3000/api?from=USD&to=BRL&amount=1
```

## Rodando testes

```
$ cd challenge-bravo
$ npm install
$ npm test
```

## Testes de carga

Duração de 10 segundos:
```
$ autocannon -c 1000 -d 10 -p 10 "http://localhost:3000/api?from=USD&to=BRL&amount=1"
Running 10s test @ http://localhost:3000/api?from=USD&to=BRL&amount=1
1000 connections with 10 pipelining factor

Stat         Avg     Stdev   Max
Latency (ms) 209.71  641.11  2493.98
Req/Sec      4228.3  2524.07 7753
Bytes/Sec    1.13 MB 676 kB  2.05 MB

42k requests in 10s, 11.2 MB read
```

Duração de 20 segundos:

```
$ autocannon -c 1000 -d 20 -p 10 "http://localhost:3000/api?from=BTC&to=BRL&amount=1"
Running 20s test @ http://localhost:3000/api?from=BTC&to=BRL&amount=1
1000 connections with 10 pipelining factor

Stat         Avg     Stdev   Max
Latency (ms) 194.65  597.75  2575.56
Req/Sec      5030.55 3114.57 10000
Bytes/Sec    1.36 MB 842 kB  2.68 MB

101k requests in 20s, 27 MB read
```