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

## Arquitetura

A arquitetura foi dividida em três componentes:

- Redis, banco chave/valor in-memory;
- Nó worker em Golang, que periodicamente recebe as cotações baseado em uma estratégia qualquer, salvando estes dados no Redis;
- Nó api em Golang, que levanta o servidor HTTP e converte baseado nas cotações armazenadas no Redis.

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

Cogitei utilizar uma lib para gerenciamento de configuração (Ex. Configor), mas para manter a simplicidade utilizei o padrão da linguagem.

### Load Balancer

Tendo em vista que o próprio Routing Mesh interno do Docker Swarm já realiza roteamento round-robin, optei por não incluir qualquer load balancer. No entanto, seria possível incluir facilmente na arquitetura. Não entendo que o caching das requisições seja tão crucial nesse use case, dado que tanto os valores convertidos quanto as cotações são dados extremamente mutáveis.
## Requisitos

- Docker-CLI/Engine (versão 18.0.9)
- Ferramenta docker-compose (versão 1.23.x)

## Rodando

### Clonando repositório


`git clone https://github.com/schonmann/challenge-bravo.git`

`cd challenge-bravo`

### Via docker-compose (recomendado)

`docker-compose up -d` (levanta nós)

`docker-compose down -d` (desce nós)

### Swarm Mode

* Manager 
    
    `docker swarm init` (inicializa swarm como manager)
    
    `docker stack deploy -c docker-compose.yml currency-conversion` (levanta stack)
    
    `docker service scale currency-conversion_api=<N>` (escala para N nós de api)
    
    `docker stack rm currency-conversion-api` (desce stack)
    
* Worker
    
    `docker swarm join --token <SWARM_TOKEN>` (joina swarm como worker)

## Performance

Para **2500** reqs/s nível de concorrência **100**, a latência média das requisições foi de **9.7 ms**:

![2500/rps](https://i.imgur.com/rHljN3u.png)

Aumentando o nível de concorrência **1000**, a latência média sobe para **31.9 ms**:

![2500/rps](https://i.imgur.com/gI5tlMZ.png)

O que parece não comprometer os resultados. Para estes testes, foi utilizada uma máquina Inspiron-7572 (i7 U + 16GB).