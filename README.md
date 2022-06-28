# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

API para conversão monetária.

## Conteúdo

- [Resumo](#resumo)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Regras de negócio](#regras-de-negócio)
- [Como usar](#como-usar)
- [Endpoints](#endpoints)
- [Testes](#testes)
  - [Testes de carga](#testes-de-carga)
  - [Testes automatizados](#testes-automatizados)
- [Melhorias futuras](#melhorias-futuras)

## Resumo

Esta API permite que você realize conversões entre diferentes moedas com **cotações reais e atuais**.

Inicialmente, as moedas suportadas para conversão são USD, BRL, EUR, BTC e ETH.

Outras moedas podem ser adicionadas com uso. Além de moedas reais (FIAT e crypto) você também pode criar moedas fictícias.

## Tecnologias

- Docker 20.10.14
- NodeJS 17.9.1
- Koa 2.13.4
- Yarn 1.22.19
- Redis 7.0.2
- Prettier 2.7.1

## Arquitetura

<p align="center">
  <img src="https://i.imgur.com/ghLYms1.png" width="800" title="source: imgur.com" />
</p>

A arquitetura da solução desenvolvida conta com 4 partes principais, sendo elas:

1. [REST API](#rest-api)
2. [Redis](#redis)
3. [Currency Tracker](#currency-tracker)
4. [Worker](#worker)

### REST API

A API é responsável por subir um servidor HTTP que atende todas as requisições do usuário. É através da API que o usuário pode criar novas moedas, obter as moedas registradas e fazer suas conversões.

### Redis

O Redis é um banco de dados **_in memory_**, ou seja, os dados são armazenados como pares chave/valor diretamente na memória.

Foram dois os motivos que levaram a decisão de usar o Redis como banco de dados:

- Performance. As consultas são extremamente rápidas, o que consequentemente, reduz o tempo de resposta da API consideravelmente.
- Simplicidade. Como os únicos dados que precisam ser persistidos são referentes as cotações das moedas, e estes dados não possuem relacionamento com nenhum outro tipo de dado, a simplicidade de uso do Redis se torna uma grande vantagem frente a utilizar um banco de dados relacional. Portanto, é uma oportunidade de reduzir a complexidade do sistema.

### Currency Tracker

O Currency Tracker é responsável por fazer a comunição com 'o mundo lá fora' e obter as cotações reais das moedas. Este é o único ponto de acesso com a API Externa.

A API utilizada foi a [CryptoCompare](https://min-api.cryptocompare.com/documentation) 🌎

### Worker

O Worker é responsável por obter as cotações mais recentes (utilizando o Currency Tracker) e atualizar as moedas registradas no sistema. Isso é feito através de um cron job que roda periodicamente (de 10 em 10 minutos).

## Regras de negócio

Apesar das especificações de requisitos do desafio serem bem claras, algumas decisões precisaram ser tomadas durante o desenvolvimento. Com a finalidade de proporcionar a melhor experência de usuário e construir uma API intuitiva e assertiva, as seguintes regras de negócio foram usadas:

- Durante a criação de novas moedas, o usuário precisa indicar se tem a intenção de criar uma moeda real ou fictícia. Desta forma, o sistema consegue saber quais moedas precisa manter atualizadas e quais não. Caso o usuário tente criar uma moeda real e o código enviado não corresponda com o de uma moeda real, o sistema da um feedback ao usuário.
- O usuário não precisa enviar o valor da moeda, caso tente criar uma moeda real.
- Somente moedas fictícias podem ser atualizadas pelo usuário.

## Como usar

Para executar o projeto pela primeira vez:

```
SETUP=true docker-compose up
```

Este comando fará o build de todos os serviços docker utilizados (redis, api e worker) e também rodará um script de setup da api que cria as moedas iniciais (USD, BRL, EUR, BTC e ETH).

As próximas vezes que quiser exectuar o sistema, você pode, opcionalmente, pular a etapa de criação das moedas inicias:

```
docker-compose up
```

Pronto, agora você pode usar a API acessando as endpoints no host e porta padrões: http://localhost:3000 🚀

## Endpoints

As endpoints da API estão documentadas [aqui](./Endpoints.md).

## Testes

### Testes de carga

O teste de carga é essencial para quantificar a performance do sistema e assegurar que o requisito não funcional especificado no desafio foi cumprido (atender pelo menos 1000 requisições por segundo). Para isso, foram feitos dois testes de carga simples utilizando a ferramenta [Artillery](https://www.artillery.io/).

**1. Utilizando 10 usuários virtuais onde cada um deles faz 1000 requisições.**

<img src="https://i.imgur.com/F8nYF2M.png" width="500" title="source: imgur.com" />

- Todas as 10000 requisições foram atendidas com sucesso. ✅
- Tivemos um _throughput_ de 1148 requisições por segundo. ✅
- A mediana do tempo de resposta foi de 3 ms. ✅
- Não é tão realista pensar em um número tão baixo de usuários fazendo esse alto volume de requisições. 👎

**2. Utilizando 1000 usuários virtuais onde cada um deles faz 10 requisições por segundo.**

<img src="https://i.imgur.com/ri5vpUs.png" width="500" title="source: imgur.com" />

- Todas as 10000 requisições foram atendidas com sucesso. ✅
- Tivemos um _throughput_ de 1070 requisições por segundo. ✅
- A mediana de tempo de resposta foi de 392 ms. 👎
- É mais realista pensar em um volume alto de usuários fazendo poucas requisições. ✅

**Considerações**

O tempo de resposta do sistema apresentou números muito melhores no primeiro teste. A principal razão para isso, é que no primeiro teste, a maioria das conexões TCP são reutilizadas, e no segundo teste, o sistema precisou abrir e fechar conexões com muito mais frequência. Isso mostra como a abertura de novas conexões TCP pode ser muito custoso.

### Testes automatizados

Foram feitos testes de integração no nível de serviço para garantir a corretude do sistema.

<img src="https://i.imgur.com/5Hutvit.png" width="500" title="source: imgur.com" />

## Melhorias futuras

1. Separar os errors por campo na resposta dada ao usuário. Isso facilita demais a invalidação de campos de formulários em uma possível aplicação front-end que use a API.
2. Fazer um melhor uso do redis. A forma que as moedas estão sendo persistidas funciona perfeitamente para requisições de conversão. Porém, na atualização das cotações, o worker precisa obter todas as moedas reais, e essa filtragem está sendo feita carregando todas as moedas em memória e depois fazendo um **_filter_**. Com certeza, há maneiras melhores de usar o redis para este caso.
3. A unica interação do usuário com a API que faz contato com a API externa é a de criação de moeda real. Isso porque o sistema precisa verificar se a existência da moeda e obter o valor mais atualizado. Isso resulta em um tempo de resposta maior que 1000 ms, o que não é muito ideal. Por outro lado, o sistema garante ao usuário que toda moeda real criada sempre terá cotações atualizadas.
4. Melhorar os testes automatizados. Foram feitos testes de integração no nível de serviço, mas ficou faltando fazer testes unitários para garantir a corretude dos componentes do sistema de forma isolada.
