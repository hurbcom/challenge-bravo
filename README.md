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

## Arquitetura
Para o desenvolvimento, a tecnologia escolhida foi Node.JS, utilizando express para servir a rota do projeto. A API utilizada para capturar a cotação de moedas foi a _openexchangerates_. Para rodar o projeto, é necessário uma chave de api. Simplesmente porque acredito que deve ser um saco ter que se cadastrar só pra rodar um pequeno projeto como esse, pode usar minha chave, eu deixo: segue ela aí `7c785382c5e840f6808c4f884560051b` :wink:

A cotação é atualizada a cada hora, porque a api atualizada atualiza sua cotação somente nessa frequência também. Obviamente, seria interessante que essa frequência pudesse ser incrementada, mas não achei nenhuma api com uma frequência de atualização maior, com todas as moedas necessárias e de preço gratuito :ok_man:. Sendo assim, a api escolhida demonstrou melhor custo benefício (principalmente porque o custo nesse caso é zero).

## Instalação e utilização
Para instalar o projeto, após execução do famigerado `git clone`, você deve realizar os seguintes passos:
```shell
cd caminho-do-clone
npm i
API_KEY=minha-ou-a-sua-chave-de-api npm run start
```

Sei que poderia ter criado um .env e ter adicionado o pacote `dotenv` pra configurar essas variáveis de ambiente, mas como só estou utilzando uma váriável, julguei que não seria necessário. Além disso, é possível rodar a aplicação em um container docker. Não se preocupe, escrevi um Dockerfile e um docker-compose para realizar essa tarefa, então, em termos práticos, você apenas precisa executar os commandos a seguir e ser feliz :smile::
```shell
cd caminho-do-clone
docker-compose up -d
```
## Requisições
A api apresenta apenas uma rota (a raiz `"/"`) e recebe os parâmetros `"from"`, `"to"` e `"amount"`, enviados via _query string_. A api retorna o json de resposta:
```shell
$ curl -i -H "Accept: application/json" -H "Content-Type:application/json" -X GET "http://localhost:3000/?from=BTC&to=ETH&amount=1" 
```
```json
{  
   "from":"BTC",
   "to":"ETH",
   "amount":"1",
   "result":31.959606435736177
}
```
Além disso, a API retorna os status code `400` e `401` para requisições inválidas, junto a uma mensagem de erro. Segue uma referência dos erros que a API retorna.

| status code   | mensagem do erro                          |
| ------------- | ------------------------------------------|
| 400           | required params "from", "to" and "amount" |
| 401           | Invalid currency. Currency must be USD, BRL, EUR, BTC or ETH |

## Testes
A aplicação foi desenvolvida com base em testes, sendo assim, quase tudo desenvolvido possui testes. Para executar estes testes, basta executar `npm test`. Para o teste de stress, utilizei duas ferramentas. A primeira é instalada com o as dependências do projeto, e fornece resultados mais simples, para caso você queira rodar um teste de stress sem adicionar nada em sua máquina. Para executá-la, rode o comando `npm run test:stress`. Você deve obter resultados semelhantes aos meus:
```shell
Summary report @ 17:25:52(-0300) 2018-09-08
  Scenarios launched:  1000
  Scenarios completed: 1000
  Requests completed:  1000
  RPS sent: 520.83
  Request latency:
    min: 0.4
    max: 21.6
    median: 2.2
    p95: 3.9
    p99: 8.6
  Scenario counts:
    0: 1000 (100%)
  Codes:
    200: 1000
```
Caso queira um resultado melhor e/ou mais detalhado, você também pode utilizar outro programa que realize a mesma tarefa. Utilizando `wrk`, obtive o seguinte resultado:
```shell
$ wrk -t20 -c500 -d10s "http://localhost:3000/?from=BRL&to=EUR
&amount=1"
Running 10s test @ http://localhost:3000/?from=BRL&to=EUR&amount=1
  20 threads and 500 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    51.53ms   40.92ms   1.17s    98.72%
    Req/Sec   509.01     93.64   757.00     79.75%
  101655 requests in 10.10s, 23.27MB read
Requests/sec:  10066.23
Transfer/sec:      2.30MB
```

Node.JS POWER :sunglasses:

Por fim, as especificações da minha máquina são estas:
```
Processador: Intel(R) Core(TM) i7-6700HQ CPU @ 2.60GHz
RAM: 15G DDR3
```

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
