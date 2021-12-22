# Conversor de moeda

API desenvolvida em Go para conversão monetária.

O sistema utiliza uma API externa com dados de taxas de câmbio para sincronização e o cálculo da conversão, para saber mais acesse [Free Currency API](https://freecurrencyapi.net/)

## Requisitos

- Utilizar cotações de verdade e atuais
- Adicionar novas moedas conforme o uso
- A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final
- Possibilitar a inclusão e remoção de moedas
- Suportar conversão entre moedas fiduciárias, crypto e fictícias
- Suportar um volume de 1000 requisições por segundo

## Endpoints

As requisições efetuadas retornam sempre como resposta uma string no formato JSON. Está configurado um Rate Limit para a quantidade de requisições efetuada no tempo de 1 minuto de acordo com o IP do usuário, caso o número de requisições exceda o permitido demais requisições serão bloqueadas.

Exemplo de requisição: http://localhost:9092/status
Padrão de resposta:

`{"data":null,"success":true,"message":"API is up and running"}`

- "data" possuirá valor quando houverem dados retornados nos acessos a API
- "success" retorna os valores true e false indicando sucesso ou falha no resultado da operação
- "message" possui mensagens relacionadas a operações efetuadas quando houverem, caso não existam mensagens será omitida do retorno

### Cadastro de novos códigos de moeda

O cadastro de novos códigos de moeda pode ser efetuado de duas maneiras distintas:

1 - Envio de uma requisição com o verbo **HTTP POST** para a URL http://localhost:9092/currency-codes, os parâmetros utilizados são:

- Code - O novo código de moeda que deve ser criado no sistema
- Rates - Um array com as taxas de câmbio relativas as moedas existentes no sistema e o valor inicial determinado

`Ex Json: {Code: ING, Rates: [{USD: 0.10000}, {BRL: 0.983746}]}`

2 - Uma requisição ao endpoint de conversão de valores com uma moeda fiduciária utilizada no from que possua taxa de conversão disponível na API externa utilizada pelo sistema.

### Exclusão de códigos de moeda

A exclusão do código de moedas só está disponível para moedas que não foram determinadas como padrão no escopo inicial do projeto, a exclusão do código de uma moeda exclui também todas as taxas de câmbia históricas armazenadas para a mesma. O verbo **HTTP DELETE** deve ser utilizado, a URL para exclusão é http://localhost:9092/currency-codes/ING ou http://localhost:9092/currency-codes?code=ING

### Conversão de moedas

A conversão de moedas será efetuada para qualquer moeda cadastrada no sistema que possua taxa de câmbio disponível e também para novas moedas fiduciárias que possuam taxa de câmbio presente na API externa. O verbo HTTP GET deve ser utilizado nas requisições e também é necessário o envio de parâmetros na URL para requisição.

Exemplo de requisição: http://localhost:9092/exchange-rate?from=USD&to=BRL&amount=2.00
Exemplo de resposta:

`{"data":[{"amount":"11,49","code":"USD-BRL","historical":"22/12/2021","rate":"5.74527"}],"success":true}`

### Sincronização

A API possui um sistema("microserviço") de sincronização de dados históricos com a API externa, esse sistema roda de tempos em tempos a fim de manter as informações consultadas o mais atuais possível e agilizar as respostas as requisições efetuadas a API. Por default o tempo determinado para a sincronização é de 2 minutos e pode ser alterado dentro do arquvio main.go. A API externa tem um consumo limitado de requisições, por esse motivo fique atento ao consumo de informações da API externa para evitar que o histórico de taxas de câmbio esteja desatualizado.

Em todo caso, caso o serviço de sincronização esteja desativado, a cada nova requisição efetuada ao endpoint de conversão de moedas os dados históricos são atualizados com os dados da API externa.

### Cache

O cache de dados históricos de taxas de conversão de moedas fica armazenado no Redis, caso o serviço de sincronização esteja ativo este cache se renovará de acordo com o tempo definido para execução da sincronização, caso o serviço de sincronização esteja desativado o cache se renovará a cada 3 minutos.

### Testes

Um dos requisitos do projeto está relacionado a capacidade da aplicação de responder bem a uma determinada quantidade de requisições por segundo. Segue abaixo dados da realização de um teste de stress utilizando a ferramenta [ApacheBench](https://httpd.apache.org/docs/2.4/programs/ab.html).

```bash
ab -n 1000 -c 1 -k "http://localhost:9092/exchange-rate?from=USD&to=EUR&amount=2.00"
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            9092

Document Path:          /exchange-rate?from=USD&to=EUR&amount=2.00
Document Length:        103 bytes

Concurrency Level:      1
Time taken for tests:   0.982 seconds
Complete requests:      1000
Failed requests:        0
Keep-Alive requests:    1000
Total transferred:      312000 bytes
HTML transferred:       103000 bytes
Requests per second:    1018.82 [#/sec] (mean)
Time per request:       0.982 [ms] (mean)
Time per request:       0.982 [ms] (mean, across all concurrent requests)
Transfer rate:          310.42 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       0
Processing:     0    1   9.9      1     314
Waiting:        0    1   9.9      1     314
Total:          0    1   9.9      1     314

Percentage of the requests served within a certain time (ms)
  50%      1
  66%      1
  75%      1
  80%      1
  90%      1
  95%      1
  98%      3
  99%      3
 100%    314 (longest request)
```

Para executar os testes criados para o sistema é necessário acessar o contâiner que roda a API e executar o comando para iniciar os testes.

```bash
$ docker exec -it challenge-bravo_api_1 /bin/sh
$ /go/src/app # go test
2021/12/22 05:41:59 1 currency_codes updated to HURB
2021/12/22 05:41:59 1 exchange_historical_rates created 
2021/12/22 05:41:59 1 exchange_historical_rates created 
2021/12/22 05:42:00 HURB-USD not found
2021/12/22 05:42:00 Mandatory data(from or to) not present in request
2021/12/22 05:42:00 1 currency_codes created to GBP
2021/12/22 05:42:00 0 exchange_historical_rates deleted to GBP-AFN
2021/12/22 05:42:00 1 exchange_historical_rates created to GBP-AFN
2021/12/22 05:42:00 GBP-AFN not found
2021/12/22 05:42:01 1 currency_codes updated to GBP
2021/12/22 05:42:01 0 exchange_historical_rates deleted to GBP-BRL
2021/12/22 05:42:01 1 exchange_historical_rates created to GBP-BRL
2021/12/22 05:42:01 GBP-BRL not found
2021/12/22 05:42:01 0 currency_codes updated to GBP
2021/12/22 05:42:01 0 exchange_historical_rates deleted to GBP-USD
2021/12/22 05:42:01 1 exchange_historical_rates created to GBP-USD
2021/12/22 05:42:01 GBP-USD not found
2021/12/22 05:42:01 0 currency_codes updated to GBP
2021/12/22 05:42:01 0 exchange_historical_rates deleted to GBP-EUR
2021/12/22 05:42:01 1 exchange_historical_rates created to GBP-EUR
2021/12/22 05:42:01 GBP-EUR not found
2021/12/22 05:42:02 1 currency_codes updated to GBP
2021/12/22 05:42:02 0 exchange_historical_rates deleted to GBP-BTC
2021/12/22 05:42:02 1 exchange_historical_rates created to GBP-BTC
2021/12/22 05:42:02 GBP-BTC not found
2021/12/22 05:42:02 0 currency_codes updated to GBP
2021/12/22 05:42:02 0 exchange_historical_rates deleted to GBP-ETH
2021/12/22 05:42:02 1 exchange_historical_rates created to GBP-ETH
2021/12/22 05:42:02 GBP-ETH not found
2021/12/22 05:42:02 unmarshal historical data error unexpected end of JSON input
2021/12/22 05:42:02 1 currency_codes deleted to GBP
2021/12/22 05:42:02 6 exchange_historical_rates deleted to GBP
2021/12/22 05:42:02 1 currency_codes deleted to HURB
2021/12/22 05:42:02 6 exchange_historical_rates deleted to HURB
PASS
ok  	api	4.614s
/go/src/app # 
```

Um grande abraço, aproveitem... :)