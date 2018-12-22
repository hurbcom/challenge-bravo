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

# Solução

<img src="https://i.imgur.com/Ti2453E.png=250" width="600"></img>

## Arquitetura

Dados os requisitos de performance, a arquitetura foi dividida em três componentes:

- Redis, banco chave/valor in-memory;
- Nó worker em Golang, que periodicamente recebe as cotações baseado em uma estratégia qualquer, salvando estes dados no Redis;
- Nó api em Golang, que levanta o servidor HTTP e serve rota de conversão, devolvendo um resultado baseado nas cotações armazenadas no Redis.

### Redis

Escolhi o Redis, nessa arquitetura, por alguns motivos: 
* Por ser um banco com consultas extremamente rápidas em suas chaves, o que ajuda a escalar em cenários de muitas requisições;
* Por ser chave e valor, mantendo o código simples, natural, e direto;
* Pela flexibilidade no caso de escalar a arquitetura, podendo utilizar as facilidades do Redis Cluster.
* Por evitar qualquer tratamento de concorrência na aplicação, caso fosse utilizada uma abordagem de armazenamento in-memory.

### Golang

Pelos requisitos de performance e simplicidade da linguagem, optei por escolher Go como linguagem de ambos os componentes API e Worker. 
Frameworks/Libs/Ferramentas:
* [Echo](https://github.com/labstack/echo), para simplificar a API e aumentar a segurança via middlewares incluídos (Anti-CSRF, XSS, etc);
* [Go Redis](https://github.com/go-redis/redis) para conexão com o banco;
* [dep](https://github.com/golang/dep/cmd/dep) para gerenciamento de dependências.

Cogitei utilizar uma lib para gerenciamento de configuração (Ex. Configor) para facilitar a passagem de configurações via variáveis de ambiente ao rodar as containers, mas para manter a simplicidade e evitar qualquer bug relacionado à ferramentas de terceiros, utilizei o padrão da linguagem.

### Load Balancer

Tendo em vista que o próprio Routing Mesh interno do Docker Swarm já realiza roteamento round-robin, optei por não incluir qualquer load balancer. No entanto, seria possível incluir facilmente na arquitetura. Não entendo que o caching das requisições seja tão crucial nesse use case, dado que tanto os valores convertidos quanto as cotações são dados extremamente mutáveis.

## Implementação

### API

A API serve um método `GET /currency/convert` para as requisições, recebendo os parâmetros:

* `from`, a moeda base.
* `to`, a moeda alvo.
* `amount`, a quantidade de unidades monetárias da moeda base.

Exemplo:

    GET http://localhost:8080/currency/convert?amount=1&from=USD&to=BRL
    
    {
        "amount":1,
        "from":"USD",
        "to":"BRL",
        "resultingAmount":3.9041
    }


Neste método, as taxas de conversão são encontradas no Redis, o cálculo é feito, e o resultado devolvido.

Nas respostas são devolvidos os mesmos parâmetros, adicionando:

* `resultingAmount`, a quantidade resultante da conversão.

Para casos de erro, foi respeitada a semântica http, com os status code corretos sendo enviados em cada caso.

Por padrão, a API serve na porta `8080`, podendo ser alterada no arquivo de configurações, ou até no mapeamento de porta `host:container`, em caso de container.

### Worker

O Worker roda periodicamente como configurado via propriedade `UpdateInterval` nas configurações da aplicação. Seu funcionamento é resumido a:
* Requisitar novas taxas de cambio, via `RequestQuotasStrategy` implementada.
* Salvar taxas de cambio no Redis.
* Aguardar por `UpdateInterval` milissegundos e executar novamente.

## Requisitos

- Docker-CLI/Engine (versão 18.0.9)
- Ferramenta docker-compose (versão 1.23.x)

## Rodando

### Clonando repositório


    $ git clone https://github.com/schonmann/challenge-bravo.git
    $ cd challenge-bravo

### Via docker-compose (recomendado)

* Levantando aplicação
    
        $ docker-compose up -d

* Descendo aplicação

        $ docker-compose down

### Swarm Mode

* Manager 
    
    * Levantando stack
        
            $ docker swarm init
            $ docker stack deploy -c docker-compose.yml currency-conversion
    
    * Escalando nós da API (Ex: 3)
        
            $ docker service scale currency-conversion_api=3    
            
    * Descendo stack
        
            $ docker stack rm currency-conversion-api
    
* Worker
    
        $ docker swarm join --token <SWARM_TOKEN>

## Performance

Para **2500** reqs/s nível de concorrência **100**, a latência média das requisições foi de **9.7 ms**:

![2500/rps](https://i.imgur.com/rHljN3u.png)

Aumentando o nível de concorrência **1000**, a latência média sobe para **31.9 ms**, o que parece não comprometer os resultados:

![2500/rps](https://i.imgur.com/gI5tlMZ.png)

Para estes testes, foi utilizada uma máquina Inspiron-7572 (i7 U + 16GB), rodando Ubuntu 18.04.

## Observações

* As API keys foram commitadas no controle de versão apenas por conveniência, e considerando o fato de serem chaves gratuitas. Entendo que não é uma boa prática e nem faria em caso de desenvolvimento produtivo.
* Tive alguns problemas pra executar em uma máquina windows utilizando swarm mode (não conseguia fazer requisições outbound para as API's de cotação de dentro das containers). Por tanto, sugiro que seja utilizado o docker-compose na avaliação.
