# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Currency Conversion API


O propósito deste projeto é mostrar que em C++ também é possível criar um serviço http de forma simples, rápida, com código legível e a já esperada alta performance. O framework usado é o CppRestSDK criado pela Microsoft. Ele fornece diversas funcionalidades, tais como: json, streaming assíncrono, cliente WebSocket, oAuth e PPL Tasks - um modelo de composiçao de operações assíncronas que usa promise/future. O framework para testes unitários é o Google Tests/Mocks. 

A única parte do código que não foi criada por mim está na pasta src/3rd-party.

Esta API limita-se a converter valor entre as seguintes moedas:
- USD
- BRL
- EUR
- BTC
- ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição recebe como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

## Como usar

- Pré-requisito: Docker Compose

- Para testar localmente, precisa rodar os seguintes comandos apenas:
  - git clone https://github.com/fabriciopf/challenge-bravo.git
  - cd challenge-bravo
  - sudo docker-compose up 		# demora um pouco :(
  
- Pronto! Agora você pode mandar requisições para a API. A documentação em Swagger pode ser acessada através de `http://localhost:8080/?validatorUrl=null`

- Para rodar os testes (os containers precisam estar de pé: docker-compose up):
  - sudo docker-compose exec currency-convert /src/build/test/allTests/allTests --gtest_shuffle

## Performance
  
- A API suporta um volume de +10K requisições por segundo em um teste de estresse rodando fora do Docker. Rodando pelo Docker chegou a um pouco +8K.

```
$ ./wrk -t9 -c1000 -R13000 -d30s "http://127.0.1.1:8000/convert?from=BRL&to=EUR&amount=359.99"
Running 30s test @ http://127.0.1.1:8000/convert?from=BRL&to=EUR&amount=359.99
  9 threads and 1000 connections
  308960 requests in 30.01s, 53.98MB read
  Socket errors: connect 0, read 0, write 0, timeout 285
Requests/sec:  10295.79
Transfer/sec:      1.80MB
```

## Backlog

- Readme: Explicar como rodar o teste de estresse.

- Polling: Inicialmente, pensei numa estratégia de TTL no Redis (cache da aplicação em memória) e quando não consigo encontrar faço uma requisição http para um site que fornece cotações em tempo real. Porém, quando a moeda (chave) expira no Redis podem chegar várias requisições simultâneas dessa mesma moeda, causando uma sobrecarga desnecessária no site de cotações, além de deixar o tempo de resposta da API mais lento também. 

- Resiliência: Utilizar mais de uma API externa para realizar requisições de cotaçao das moedas.  

- Memory Leak: Ainda não rodei o Valgrind pra verificar se serviço está gerando memory leak.

- Variáveis: Algumas variáveis estão hardcoded, devendo ser convertidas para constante e/ou variável de configuração.

- Testes Unitários: Preciso terminar de criar alguns testes unitários pra aumentar a cobertura de código. Desejável: 100%.

- Segurança: A API está vulnerável a ataques DDoS. Vou colocar um NGINX na frente da API para controlar o fluxo de requisições. `https://www.nginx.com/blog/rate-limiting-nginx/`

- Redis: Garantir alta disponibilidade do Redis usando Redis Sentinel: `https://redis.io/topics/sentinel`

- Monitoramento: enviar dados do SO (cpu, memória, espaço em disco) e do serviço (count de requisições realizadas e http-status retornado) para o Graylog

- Docker: Criar um Docker específico para desenvolvimento (geração de pacote de instalação, testes unitários, teste de estresse, etc.) e outro para deploy, contendo apenas o que é essencial para rodar o serviço em produção.  

- Mock: Mockar o Redis pra não precisar dele quando for rodar os testes unitários.

<p align="center">
  <img src="mdmc.jpg" alt="Missão dada, parceiro, é missão cumprida!" />
</p>
