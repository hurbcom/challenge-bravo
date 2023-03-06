# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

# Menu
- [Como rodar o projeto?](#como-rodar-o-projeto)
    - [Pré-requisito](#pré-requisito)
    - [Comandos para instalar os pacotes](#comandos-para-instalar-os-pacotes)
    - [Comandos para rodar em dev](#comandos-para-rodar-em-dev)
    - [Comandos para rodar em Prod](#comandos-para-rodar-em-prod)
- [Endpoints](#endpoints)
    - [Conversão da moeda(GET)](#conversão-da-moedaget)
    - [Adição de moeda(POST)](#adição-de-moedapost)
    - [Remoção de moeda(DELETE)](#remoção-de-moedadelete)
- [O Problema](#o-problema)
- [A Solução](#a-solução)
    - [Escolhas técnicas](#escolhas-técnicas)
    - [SourceType](#sourcetype)
    - [Arquitetura do projeto](#arquitetura-do-projeto)
    - [Clean Architecture Layers](#clean-architecture-layers)
    - [As Entidades](#as-entidades)
    - [Fluxograma da conversão](#fluxograma-da-conversão)
    - [Testes](#testes)
    - [Teste de estresse](#teste-de-estresse)

# Como rodar o projeto?
## Pré-requisito
É preciso ter o Redis rodando antes de iniciar o projeto.

Podemos rodar com o comando do docker-compose, na pasta raiz do projeto:

```sh
docker-compose up redis
```
## Comandos para instalar os pacotes
Instalar os pacotes:
```sh
npm i
```
## Comandos para rodar em dev
Rodar:
```sh
npm run dev
```
## Comandos para rodar em prod
Build:
```sh
npm run build
```
Rodar:
```sh
npm run start
```
# Endpoints
## Conversão da moeda(GET)
Se utiliza desse endpoint com método GET para obter a conversão de um valor de uma moeda para outra, exemplo: Saber qual o valor em Real equivalente a 10 BTC.

Na query enviamos essas 3 propriedades, todas são obrigatórias:
- from: Moeda de origem, no caso BTC.
- to: Moeda final, no caso BRL.
- amount: Valor da moeda de origem, no caso 10.

```
(GET) http://localhost:3000/currency?from=BTC&to=BRL&amount=10
```

```sh
curl --location 'http://localhost:3000/currency?from=BTC&to=BRL&amount=10
```

## Adição de moeda(POST)
Esse endpoint tem como finalidade adicionar uma moeda, além das já cadastrada, exemplo: Adicionar a moeda HURB com o valor de 1 HURB = 0,5 USD, sendo um valor fixo.

A moeda tem 4 propriedades:
- id: Nome/simbolo da moeda, precisa ser único, é obrigatório. (HURB)(String)
- sourceType: O tipo da origem é obrigatório e pode ser um desses desses valores:
    - fixed: É uma moeda que cadastramos com o valor fixo em dólar americano(USD), precisando preencher o campo "dollarRate".
    - coingate: Utilizamos esse tipo quando queremos que o valor da moeda em USD seja buscado no coingate(API Externa) dinamicamente, sendo assim, não precisamos preencher o campo "dollarRate".
- dollarRate: Valor da moeda em USD (0.5).
- name: O nome da moeda (Hurb coin).

```
(POST) http://localhost:3000/currency
```

```sh
curl --location 'http://localhost:3000/currency' \
--header 'Content-Type: application/json' \
--data '{
    "id": "HURB",
    "sourceType": "fixed",
    "dollarRate": 0.5,
    "name": "Hurb coin"
}'
```
## Remoção de moeda(DELETE)
Remove uma moeda criada, basta adicionar o ID da moeda no params: exemplo: Remover a moeda com o id HURB.

```
(DELETE) http://localhost:3000/currency/HURB
```

```sh
curl --location --request DELETE 'http://localhost:3000/currency/HURB'
```
# O Problema
- Adicionar um endpoint para fazer a conversão de um valor em uma moeda de origem para outra final, usando dólar como moeda de lastro e utilizar, quando necessário, uma API externa para ter o valor atualizado da moeda em USD.
- Ter um endpoint para adicionar novas moeda que não estão previamente cadastradas.
- Ter essas moedas previamente cadastradas:
    -   USD
    -   BRL
    -   EUR
    -   BTC
    -   ETH
- Ter um endpoint de remoção de moedas cadastrada.
- A API deve suportar mais de 1000 requisições por segundo.
- Ter testes com uma boa taxa de cobertura.
- Rodar em docker.

# A Solução
## Escolhas técnicas
### Banco de dados:
Para tentar atingir a capacidade de 1000 req/seg optei por usar um banco de rápido acesso/leitura (chave-valor) como o redis.

Tento em vista a simplicidade da estrutura de dados do projeto não seria necessário ter dados com relacionamento, evitando assim, o uso de um banco SQL como Postgres, sendo o Redis um banco não relacional chave-valor.

### Linguagem
Tendo Javascript/Nodejs como minha stack principal e acreditando que o mesmo se encaixa para a finalidade desse projeto por ser um projeto pequeno e com alta escalabilidade.
### Framework web
Ao utilizar express busquei um projeto mais enxuto, um menor consumo de RAM, com menos coisas "já prontas" e um framework menos "opinado", assim tendo mais liberdade de escolher os melhores padrões de projeto para um sistema de pequeno porte como esse.

### Linters e typescript
Usando o eslint + pritter + typescript busco ter uma melhor qualidade de código e ajuda em encontrar problemas mais cedo.

### Inversion of control
Como nesse projeto busco utilizar o conceito de inversão de controle, optei por utilizar o invesify, uma lib que facilita o gerenciamento da inversão de controle.
## SourceType
Utilizei esse mecanismo para poder ter várias opções de obtenção do valor da moeda em dólar, dessa forma, é possível adicionar facilmente outro sourceType, além do fixed e coingate.

Exemplo, caso queria adicionar outra API externa, basca criar uma classe que implementa a interface IExternalSourceType, adicionar ele no CurrencyService e depois adicionar esse sourceType na validação da criação de uma nova currency/moeda. 
## Arquitetura do projeto
Visão geral da comunicação do sistema:

![Arquitetura](./Docs/Images/Arch.png)
## Clean Architecture Layers
Utilizando o padrão de camadas da arquitetura limpa busco alcançar uma abstração onde as camadas mais externas são "detalhes" que mudam com mais frequência com a evolução do projeto. Enquanto as internas são regras de negócio, mais abstratas, com menos dependências externas e alterações durante o desenvolvimento do projeto.

![Camadas](./Docs/Images/Layers.png)
## As Entidades
As duas principais estruturas de dados do sistema:

![Estrutura de dados](./Docs/Images/Data-structure.png)
## Fluxograma da conversão
O ponto mais desafiador do projeto era criar um sistema de conversão utilizando uma api externa para pegar o valor da moeda em dólar e conseguir atingir os 1000 req/seg, com isso em mente, busquei estabelecer alguns pontos, como, não depender 100% da api externa para ter esse dado, pois, poderia tomar um bloqueio da mesma ou ela não responder na quantidade necessária por segundo.

Com isso, optei por consultar a api poucas vezes e guardar em cache(Redis) esse valor, evitando várias requisições desnecessárias e diminuindo a duração da minha requisição.

Porém, da forma que foi desenvolvido, a primeira requisição do serviço pode demorar mais que o normal, pois, a mesma solicitará a API externa primeiro. Para amenizar esse processo, assim que o sistema se inicia ele tenta busca o valor em dólar de todas as moedas cadastradas.

Segue o fluxograma de como é feita a conversão das moedas para entender melhor:
![Fluxograma da conversão](./Docs/Images/Conversion-flow.png)
## Testes
Para os teste, utilizei o jest como suite de teste, supertest para teste de integração(e2e) e redis-memory-server para criar um redis na memória para testar durante os teste de integração, evitando assim, rodar um redis externo durante os testes.

Como rodar os Testes:
```sh
npm run test
```
### Cobertura de Teste
![Coverage](./Docs/Images/Coverage.png)

## Teste de estresse

Utilizei o artillery para poder fazer esse teste de estresse, utilizando esse cenário de teste:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 10
      arrivalRate: 1500
scenarios:
  - flow:
    - get:
        url: "/currency?from=BRL&to=EUR&amount=500"
```
Comando:
```sh
npm run test:stress
```

### Resultado
![Resultado do teste de estress](./Docs/Images/stress-test.png)

Com esse resultado, o sistema conseguiu atingir 1500 req/s com ótimas taxas de duração, não fui muito mais além desse valor por já ter atingindo o esperado. 