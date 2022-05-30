# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

Foi construído um serviço para conversão de moedas em microsserviço em docker, separados nos seguintes aplicações.
-   Quote-Manager: Responsável por gerenciar a moedas(CRUD), buscar as cotações atualizadas e salvar no redis, podendo ter ou não tempo de expiração(variável de ambiente).
-   coin-converter: Responsável por receber as requisições e calcular as conversões, buscando a cotação no redis. Sua estrutura permite ser escalada horizontalmente. (Esse serviço pode ser substituído por uma lambda e apiGateway da AWS.)
-   Mongodb: Responsável por armazenar as informações da moeda que tem o interesse de converter.
-   redis: Responsável por manter as contações atualizadas, o serviço coin-converter consulta em todas as requisições com o objetivo de reduzir o tempo de resposta.
-   Cronjob: Responsável por disparar os eventos que irá fazer o quote-manager buscar as cotações na api de cotação e atualizar no redis.  

<p align="center">
  <img src="Arquitetura-diagrama.svg" alt="Diagrama da Arquitetura" />
</p>

## Melhorias
-   Criar login para controlar quem pode e quem faz as alterações no registro da moeda ou alterou as cotações.
-   Implementar login no redis e proxy para limitar os IPs que podem acessá-lo.
-   Utilizar certificado digital para requests em https.
-   Aplicar proxy no servidor coin-converter bloqueando qualquer acesso externo que seja diferente da porta 80 ou utilizar apiGateway e bloquear qualquer acesso externo ao servidor.
-   Caso o serviço de cadastro seja publico, deve ser bloqueado qualquer acesso externo que seja diferente da porta 80 ou utilizar apiGateway e bloquear qualquer acesso externo ao servidor. Nos dois casos deve-se limitar qual request ficará disponível.
-   Utilizar um orquestrador tipo Kubernetes, Swarm ou Elasticbeanstalk.

## Pré Requisitos

Aplicação foi desenvolvida em node 16.15.0, utilizando docker e docker compose.
Para rodar em ambiente docker será necessário a instalação do docker com o compose.
-   docker 20.10.16
-   docker compose 2.5.0

Desta forma, só precisa instalar o docker e executar.

Para rodar fora do docker será necessário ter os seguintes serviços disponíveis
-   Mongodb: A URL de conexão tem que estar em uma variável de ambiente 
    -   MONGODB_URL 
-   Redis: A URL de conexão e alterar o tempo de expiração de um registro, tem que estar em uma variável de ambiente
    -   REDIS_URL
    -   REDIS_CACHE_EXPIRE: Deve ser atribuído o tempo em segundos o valor zero desativa a função
-   Cronjob: Esse serviço pode ser substituído por outro scheduling, desde que consiga enviar um request
    -   curl --request PUT --url http://localhost:3001/api/quote

## Executando o serviço

Para executar o serviços em docker será necessário usar os seguintes comandos:

Construir as images de cada componente
```bash
$ docker compose build
```
Executar o ambiente em primeiro plano mostrando os logs
```bash
$ docker compose up
```
Executar o ambiente em segundo plano

```bash
$ docker compose up -d
```

Para visualizar os logs dos serviços em execução
```bash
$ docker ps
$ docker logs -f <nome-container>
```
## Documentação

Foi criado documentação da API utilizando swagger 
http://localhost:3001/api-docs/


<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
