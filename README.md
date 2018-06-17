# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

API em PHP, que responde JSON, para conversão monetária. Ela usa dólar americano como lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API suporta as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH


Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição recebe como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

## Benchmark

#### Como executar:

```
$ make up
$ make run_benchmark
```

#### Resultado
```
This runs a benchmark for 30 seconds, using 8 threads, keeping 1000 HTTP connections open, and a constant throughput of 6000 requests per second
Running 30s test @ http://nginx/api/convert?from=BTC&to=BRL&amount=1
  8 threads and 1000 connections
  Thread calibration: mean lat.: 20.276ms, rate sampling interval: 95ms
  Thread calibration: mean lat.: 23.998ms, rate sampling interval: 79ms
  Thread calibration: mean lat.: 20.084ms, rate sampling interval: 93ms
  Thread calibration: mean lat.: 21.894ms, rate sampling interval: 66ms
  Thread calibration: mean lat.: 46.446ms, rate sampling interval: 95ms
  Thread calibration: mean lat.: 147.339ms, rate sampling interval: 1087ms
  Thread calibration: mean lat.: 20.090ms, rate sampling interval: 94ms
  Thread calibration: mean lat.: 70.476ms, rate sampling interval: 115ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   486.68ms    1.58s   12.32s    92.35%
    Req/Sec   460.04    428.29     4.16k    66.26%
  130588 requests in 30.03s, 39.85MB read
  Socket errors: connect 0, read 349, write 0, timeout 3365
Requests/sec:   4347.90
Transfer/sec:      1.33MB
```

