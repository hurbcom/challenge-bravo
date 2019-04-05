# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Arquitetura
APIs utilizadas para consulta de cotação:
- [Fixer](https://fixer.io/)
- [CoinMarketCap](https://coinmarketcap.com/api/)

Tecnologias utilizadas no desenvolvimento:
- Docker
- Golang
- Redis

Para suportar uma grande quantidade de requisições simultâneas a idéia foi cachear as informações de cotação em uma banco de dados em memória, no caso, um Redis.

Um worker é responsável por buscar as cotações nas APIs e atualizar de tempos em tempos os valores no banco de dados, deixando a API com a única função de buscar o dado e processar a requisição.

                                                                           get quotes     +-------------------+
                                                                           +------------->+                   |
                                                                           |              | CryptoCurrencyAPI |
                                                                           |              |                   |
                                                   +-------+         +-----+--+           +-+-----------------+
                                                   |       |         |        |             |
                                                   | Redis +<--------+ Worker +<------------+
                                                   |       |         |        |
                                                   +--+----+         +-----+--+<-------------+
                                                      |                    |                 |
                                                      | get quotes:        |                 |
                                                      |  BRL,BTC           |               +-+---------+
                                                      v                    +-------------->+           |
                                                   +--+--+                  get quotes     | CryptoAPI |
     /convert?amount=12&from=BRL&toBTC ----------->+     |                                 |           |
                                                   | API |                                 +-----------+
       {"success":true, "result": 123} <-----------+     |
                                                   +-----+



## Operação



Para iniciar o sistema clone este repositório:
```bash
	git clone https://github.com/vitoriario2/challenge-bravo
```

Rode o seguinte comando a partir da raiz do projeto:
```bash
	make install
```

Os containers poderão ser visualizados da seguinte forma:

```bash
$ docker ps

CONTAINER ID  IMAGE               COMMAND                  CREATED           STATUS          PORTS                    NAMES

d954bd5f0503  deployments_api     "go run cmd/api/main…"   5 seconds ago     Up 3 seconds    0.0.0.0:8081->8081/tcp   api

243c155c3df6  deployments_worker  "go run cmd/worker/m…"   6 seconds ago     Up 4 seconds                             deployments_worker_1

f8bf3f6058ea  redis               "docker-entrypoint.s…"   7 seconds ago     Up 5 seconds    6379/tcp                 redis_db
```

Neste ponto, a API já estará pronta para receber requisições na porta 8081.

## Interoperabilidade


### (GET) /healthcheck

#### Descrição
verifica o status da API

#### Resposta
Em caso de sucesso a API irá retornar uma simples resposta em texto claro "OK" com status code 200.

Qualquer retorno diferente do especificado significa que a API não está funcionando corretamente.

#### Exemplo
```bash
$ curl 'localhost:8081/healthcheck' -i

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: text/plain; charset=UTF-8
Vary: Origin
Date: Fri, 05 Apr 2019 15:34:23 GMT
Content-Length: 2

OK
```


### (GET) /convert

#### Descrição
Converte uma determinada quantia de uma moeda para outra

#### Parâmetros
Os seguintes parâmetros devem ser passados como parâmetros da url:
- **amount** - float: quantia que se deseja converter
- **from** - string: símbolo da moeda de origem
- **to** - string: símbolo da moeda de destino

#### Resposta

Em caso de sucesso a API retornará um JSON no seguinte formato com status code 200:
```json
{
	"success": true,
	"result": <float_number>
}
```

Caso algum erro tenha ocorrido uma resposta JSON também será retornada com o status code 400:
```json
{
	"success": false,
	"message": <string_message>
}
```

As possíveis mensagens de erro são:
- **error on getting currency quotes**: Erro ao obter informações do banco de dados
- **currency symbol not found**: O símbolo passado não existe na base de dados


#### Exemplo
```bash
$ curl 'localhost:8081/convert?amount=1&from=BRL&to=ETH' -i

HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=UTF-8
Vary: Origin
Date: Fri, 05 Apr 2019 15:35:19 GMT
Content-Length: 32

{"result":33.67,"success":true}
```

## Benchmarking



<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
