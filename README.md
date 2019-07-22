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

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:
- JavaScript (NodeJS)
- Python
- Go
- Ruby
- C++
- PHP

Você pode usar qualquer _framework_. Se a sua escolha for por um _framework_ que resulte em _boilerplate code_, por favor assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.

## Requisitos
- Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um *pull request*.
- O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
- Para executar seu código, deve ser preciso apenas rodar os seguintes comandos:
  - git clone $seu-fork
  - cd $seu-fork
  - comando para instalar dependências
  - comando para executar a aplicação
- A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.



## Critério de avaliação

- **Organização do código**: Separação de módulos, view e model, back-end e front-end
- **Clareza**: O README explica de forma resumida qual é o problema e como pode rodar a aplicação?
- **Assertividade**: A aplicação está fazendo o que é esperado? Se tem algo faltando, o README explica o porquê?
- **Legibilidade do código** (incluindo comentários)
- **Segurança**: Existe alguma vulnerabilidade clara?
- **Cobertura de testes** (Não esperamos cobertura completa)
- **Histórico de commits** (estrutura e qualidade)
- **UX**: A interface é de fácil uso e auto-explicativa? A API é intuitiva?
- **Escolhas técnicas**: A escolha das bibliotecas, banco de dados, arquitetura, etc, é a melhor escolha para a aplicação?

## Dúvidas

Quaisquer dúvidas que você venha a ter, consulte as [_issues_](https://github.com/HotelUrbano/challenge-bravo/issues) para ver se alguém já não a fez e caso você não ache sua resposta, abra você mesmo uma nova issue!

Boa sorte e boa viagem! ;)

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>


# Solução

Foi desenvolvida uma API em Python (2.7) usando o framework Pyramid para subir um REST server como base para o desafio.
Durante a execução da aplicação há um job que atualiza o valor da cotação das moedas a cada 5 segundos em uma thread à parte.
A porta usada pelo servidor ficou fixada como 6543.

### Requerimentos

Para executar é necessário instalar as bibliotecas: pyramid e requests.

```
pip install pyramid
pip install requests
```

### Executando

Para subir a aplicação basta executar o seguinte comando:

`python src/conv.py`

### Testando a aplicação

O endereço do endpoint e os parâmetros esperados ficaram definidos como:

`/api?from=BTC&to=BRL&amount=2`

#### Client

```
$ curl 'http://localhost:6543/api?from=BTC&to=BRL&amount=2' -vvvvv
* Hostname was NOT found in DNS cache
*   Trying ::1...
* connect to ::1 port 6543 failed: Connection refused
*   Trying 127.0.0.1...
* Connected to localhost (127.0.0.1) port 6543 (#0)
> GET /api?from=BTC&to=BRL&amount=2 HTTP/1.1
> User-Agent: curl/7.38.0
> Host: localhost:6543
> Accept: */*
> 
* HTTP 1.0, assume close after body
< HTTP/1.0 200 OK
< Date: Fri, 19 Jul 2019 04:58:24 GMT
< Server: WSGIServer/0.1 Python/2.7.9
< Content-Type: application/json
< Content-Length: 127
< 
* Closing connection 0
{"rate_from": 9.606147934687422e-05, "rate_to": 3.7592724679, "from": "BTC", "to": "BRL", "amount": 2.0, "result": 78268.05278}
```

#### Server

```
2019-07-19 02:02:02,173 | DEBUG        | Thread-1     | "GET /public?command=returnTicker HTTP/1.1" 200 None
2019-07-19 02:02:06,037 | INFO         | MainThread   | {'rate_from': 9.57905841581758e-05, 'rate_to': 3.7592724679, 'from': u'BTC', 'to': u'BRL', 'amount': 2.0, 'result': 78489.39436}
```

### Stress test
```
$ wrk -t2 -c2 -d1s 'http://localhost:6543/api?from=BTC&to=BRL&amount=1'
Running 1s test @ http://localhost:6543/api?from=BTC&to=BRL&amount=1
  2 threads and 2 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     1.99ms    1.02ms  14.45ms   86.60%
    Req/Sec   502.14    131.20     0.95k    85.71%
  1051 requests in 1.10s, 279.19KB read
Requests/sec:    955.36
Transfer/sec:    253.78KB
```
