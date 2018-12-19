# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve converter entre as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

# Projeto

## Teste de carga:

### Rodar o teste de carga:

`
node_modules/.bin/loadtest http://127.0.0.1:3000/api/conversion\?from\=ETH\&to\=BRL\&amount\=100 -t 20 -c 1000 --rps 1000
`

```
[Wed Dec 19 2018 01:34:51 GMT-0200 (Brasilia Summer Time)] INFO Requests: 0, requests per second: 0, mean latency:0 ms
[Wed Dec 19 2018 01:34:56 GMT-0200 (Brasilia Summer Time)] INFO Requests: 5000, requests per second: 1001, mean latency: 3.3 ms
[Wed Dec 19 2018 01:35:01 GMT-0200 (Brasilia Summer Time)] INFO Requests: 10000, requests per second: 1000, mean latency: 2 ms
[Wed Dec 19 2018 01:35:06 GMT-0200 (Brasilia Summer Time)] INFO Requests: 15000, requests per second: 1000, mean latency: 2 ms
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Target URL:          http://127.0.0.1:3000/api/conversion?from=ETH&to=BRL&amount=100
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Max time (s):        20
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Concurrency level:   1000
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Agent:               none
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Requests per second: 1000
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Completed requests:  18211
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Total errors:        1
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Total time:          20.000364915 s
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Requests per second: 911
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Mean latency:        2.5 ms
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO Percentage of the requests served within a certaintime
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO   50%      1 ms
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO   90%      3 ms
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO   95%      6 ms
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO   99%      16 ms
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO  100%      108 ms (longest request)
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO  100%      108 ms (longest request)
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO
[Wed Dec 19 2018 01:35:11 GMT-0200 (Brasilia Summer Time)] INFO    -1:   1 errors
```