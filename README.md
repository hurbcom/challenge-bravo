# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

## Arquitetura do projeto
A API foi escrita em Node.JS,p ara o servidor da aplicação foi utilizado o Express.JS e para termos as cotações atuais em cache utilizei o redis.

Para a captação das cotações foi utilizada a API da `openexchangerates`. Ela por sua vez precisa de uma chave de acesso para ser utilizada, essa chave está no arquivo `.env` do projeto è gerenciada pelo pacote dotenv.A utilização dessa api é um pouco limitada em seu plano free, por tanto eu mantenho as cotações atualizadas a cada 5 minutos (300000ms).

Para execução de nossos testes utilizei `MochaJS` juntamente ao `Chai.JS` e para o teste de Desempenho utilizei a toolkit do `Artillery`.

## Instalando e Iniciando a aplicação

Levando em consideração que voce já tem instalado na maquina os softwares abaixo:

- Git
- Docker
- Docker-compose
- Node.js
- npm

#### Clonar repositório e acessar seu repositório `cd <seu-repo>`:

> git clone https://github.com/mateusschenatto/challenge-bravo.git 

#### Comando para instalar dependências

> npm install

#### Comando para iniciar a aplicação

> docker-compose up

- Com isso a aplicação deve estar executando.

## Requisitando a API

A API recebe requisições com três parâmetros, "from" moeda de origem, "to" moeda de destino e "amount" quantia a ser convertida, via _query_string_. Ela valida a requisição e caso esteja tudo ok executa a conversão das moedas retornando um JSON com "from", "to", "amount" e "result" que irá conter o resultado da conversão. Segue um exemplo de requisição e resposta: 
```shell
curl --request GET \
  --url 'http://localhost:3000/api/convert?from=EUR&to=BRL&amount=1' \
  --header 'cache-control: no-cache'
```

``` json
{
    "from": "EUR",
    "to": "BRL",
    "amount": "1",
    "result": 4.347171310627198
}
```

Mas e se ocorrer um erro na requisição ? Nesse caso a API retornara um JSON com  a key "error" que contém uma mensagem associada com o problema, além da requisição retornar um status code diferente de 200. Segue uma relação de status e mensagens devolvidas em caso de erro:

| status code   |  error message                          |
| ------------- | ------------------------------------------|
| 400           | Parametros obrigatorios "from", "to" and "amount". Faltou os parametros {lista de parametros que faltam}. |
| 400           | Parametro "amount" precisa ser númerico. |
| 400           | Moeda de origem "from". Aceitamos apenas conversões das seguintes moedas: USD,BRL,EUR,BTC,ETH |
| 400           | Moeda de destino "to". Aceitamos apenas conversões das seguintes moedas: USD,BRL,EUR,BTC,ETH |
| 500           | Internal server error. |

## Testes

Todos os testes foram realizados em um ambiente Windows com a seguinte configuração:
```
Processador: Intel(R) Core(TM) i5-7200U CPU @ 2.70GHz
RAM: 8G DDR3
```

Foi desenvolvido estruturas de scripts de testes, como dito utilizando o Mocha e Chai, para utilizar estes scripts basta executar o comando `npm run test` com a aplicação offline ou seja sem estar executando.

Para o teste de desempenho utilizamos a toolkit do Artillery, foram executados testes de carga chegando a um resultado alto de requisições por segundo. Por tanto para executar este teste é necessário que a aplicação esteja rodando, execute os seguintes comandos:

```shell
docker-compose up
npm run performance-test
```

``` shell
Started phase 2 (Carga máxima), duration: 60s @ 09:23:09(-0300) 2019-04-04
Report @ 09:23:28(-0300) 2019-04-04 
Elapsed time: 2 minutes, 23 seconds 
  Scenarios launched:  1136         
  Scenarios completed: 1136         
  Requests completed:  1136         
  RPS sent: 113.71                  
  Request latency:                  
    min: 20.8                       
    max: 100.3                      
    median: 30.8                    
    p95: 51                         
    p99: 74.8                       
  Codes:                            
    200: 1136
```

-------

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
