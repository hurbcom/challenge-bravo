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

# Resposta ao Desafio Bravo
Foram construídas 2 APIs, respondesndo em JSON. Uma feita em **python** com flask e a outra em **golang** com mux.
Como pode ser visto abaixo, para a arquitetura escolhida, é usado um worker que é capaz de buscar cotações atuais entre diversas moedas e à partir de fontes diversas além de ser responsável por atualizá-las a cada 30 min. Por isso, não foi usada uma moeda de lastro para as conversões.

## Arquitetura
<p align="center">
  <img src="architecture.png" alt="Architecture" />
</p>

### Worker:
- Faz carga inicial das moedas no redis no formato **FROMTO** Ex: `From USD To BRL -> USDBRL:3.258`
- Resposável por manter as cotações sempre atualizadas.
- Foi construído com um scheduler que a cada 30 minutos busca as cotações atualizadas em algumas fontes na internet e as salva no redis no formato mencionado acima.
- Permite diminuir o tempo de resposta da API já que não necessitará consultar a atualização na internet.

### Redis:
- Banco NoSql chave valor in_memory, extremamente rápido.
- Possibilita cache de cotações para consultas da API.

### API:
- Responde aos requests http de converções dos usuários e processa as requisições entregando o resultado da cotação processada no formato **JSON**.

### NGIX:
- Realiza cache (com TTL 2minutos) da resposta da API conforme a query_string assim, a API não precisará processar mais de uma vez a mesma requição dentro do prazo do cache.

## EXECUTANDO
- Pré-requisito: docker-compose
```bash
  $> git clone https://github.com/maypimentel/challenge-bravo.git
  $> cd challenge-bravo
  $> ./run.sh
```
Ex: `http://localhost:3333/python_api/?from=USD&to=EUR&amount=564.3` ou

`http://localhost:3333/go_api/?from=USD&to=EUR&amount=564.3`

## TESTES de carga
### API em GOLANG
- Atendeu mais de 5mil requisições por segundo
```bash
maycon@maycon-VirtualBox:~/challenge-bravo$ wrk -t9 -c1000 -R13000 -d30s "http://localhost:8000/converter/?from=USD&to=eur&amount=56565.2"
Running 30s test @ http://localhost:8000/converter/?from=USD&to=eur&amount=56565.2
  9 threads and 1000 connections
  Thread calibration: mean lat.: 3225.231ms, rate sampling interval: 11526ms
  Thread calibration: mean lat.: 2684.706ms, rate sampling interval: 10362ms
  Thread calibration: mean lat.: 3288.142ms, rate sampling interval: 11812ms
  Thread calibration: mean lat.: 3029.865ms, rate sampling interval: 10878ms
  Thread calibration: mean lat.: 3222.366ms, rate sampling interval: 11403ms
  Thread calibration: mean lat.: 3157.311ms, rate sampling interval: 11493ms
  Thread calibration: mean lat.: 2711.585ms, rate sampling interval: 10436ms
  Thread calibration: mean lat.: 3321.223ms, rate sampling interval: 11649ms
  Thread calibration: mean lat.: 3163.072ms, rate sampling interval: 11698ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    11.69s     3.63s   19.45s    60.73%
    Req/Sec   601.33     30.24   637.00     55.56%
  160725 requests in 30.00s, 30.50MB read
Requests/sec:   5357.19
Transfer/sec:      1.02MB
```
### API em PYTHON
- Atendeu a pouco mais de 600 requisições por segundo
```bash
maycon@maycon-VirtualBox:~/challenge-bravo$ wrk -t9 -c1000 -R13000 -d30s "http://localhost:8888/converter/?from=USD&to=eur&amount=56565.2"
Running 30s test @ http://localhost:8888/converter/?from=USD&to=eur&amount=56565.2
  9 threads and 1000 connections
  Thread calibration: mean lat.: 3995.608ms, rate sampling interval: 16990ms
  Thread calibration: mean lat.: 4522.102ms, rate sampling interval: 15376ms
  Thread calibration: mean lat.: 4577.954ms, rate sampling interval: 13795ms
  Thread calibration: mean lat.: 3477.261ms, rate sampling interval: 12689ms
  Thread calibration: mean lat.: 3713.810ms, rate sampling interval: 14426ms
  Thread calibration: mean lat.: 4011.517ms, rate sampling interval: 14688ms
  Thread calibration: mean lat.: 4481.127ms, rate sampling interval: 15327ms
  Thread calibration: mean lat.: 3818.135ms, rate sampling interval: 15081ms
  Thread calibration: mean lat.: 3708.798ms, rate sampling interval: 14131ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    18.29s     5.05s   29.43s    58.59%
    Req/Sec    67.00     39.98   127.00     55.56%
  20691 requests in 30.24s, 5.27MB read
  Socket errors: connect 0, read 0, write 0, timeout 9342
Requests/sec:    684.13
Transfer/sec:    178.39KB
```
### NGINX com qualquer API
- Atendeu a mais de 12 mil requisições por segundo
```bash
maycon@maycon-VirtualBox:~/challenge-bravo$ wrk -t9 -c1000 -R13000 -d30s "http://localhost:3333/python_api/?from=USD&to=eur&amount=56565.2"
Running 30s test @ http://localhost:3333/python_api/?from=USD&to=eur&amount=56565.2
  9 threads and 1000 connections
  Thread calibration: mean lat.: 236.036ms, rate sampling interval: 694ms
  Thread calibration: mean lat.: 230.232ms, rate sampling interval: 659ms
  Thread calibration: mean lat.: 242.501ms, rate sampling interval: 664ms
  Thread calibration: mean lat.: 295.256ms, rate sampling interval: 2297ms
  Thread calibration: mean lat.: 311.887ms, rate sampling interval: 2494ms
  Thread calibration: mean lat.: 297.582ms, rate sampling interval: 2158ms
  Thread calibration: mean lat.: 216.182ms, rate sampling interval: 869ms
  Thread calibration: mean lat.: 334.815ms, rate sampling interval: 2496ms
  Thread calibration: mean lat.: 313.218ms, rate sampling interval: 2453ms
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.09s     1.18s    5.82s    84.49%
    Req/Sec     1.36k   305.63     3.69k    88.19%
  364134 requests in 29.96s, 93.40MB read
  Socket errors: connect 0, read 0, write 0, timeout 356
Requests/sec:  12155.89
Transfer/sec:      3.12MB
```
- Justificando que a arquitetura defida com um cache frontal foi acertada.

## Bônus
### SWAGGER
- Interface do SWAGGER para testes e documentação
```javascript
http://127.0.0.1:3333/swagger/
```
