# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo



## Tecnologias utilizadas
### Back End
###### Foi criada uma Api  Rest, utilizando a linguagem Javascript com o Framework NodeJS. Por se trratar de uma linguagem robusta e muito utilizada no mercado de TI, o autor do projeto decidiu utilizá-la para o backend.<p>
O desenvolvimento seguiu o padrão MVC, utilizando os seguintes recursos:

* [NPM](https://www.npmjs.com/) e suas features para gestão de dependências e start do projeto.
* Para a persistência foi utilizada o NOSQL [mongo database](https://www.mongodb.com/).
* Para testes foram utilizados [Mocha](https://www.npmjs.com/package/mocha).

## Boilerplate code
Para persistencia usei o mongoose, gerando um boilerplate code mas dado o escopo do projeto não vi nenhum problema.

## Como rodar as aplicações

Para rodar a aplicação em um ambiente isolado com Virtual Machine ou mesmo no sistema operacional, é utilizado o recurso do Docker-Compose, que está configurado para subir as duas instancias de Docker e permitir a comunicação entre elas. A porta 3000 será utilizada para a api de backend enquanto a 27017 para a  instancia do mongod.
Entre na raiz do projeto e rode esse comando:
`docker-compose up`


##### Docker compose

Obs: Se desejar rodar as aplicações fora do containers Docker, faça o clone do projeto no link https://github.com/SelecaoGlobocom/paulo-henrique-freitas
e siga os seguintes passos:

#### Back End

<abbr> *Passo 1:*</abbr> Entre no projeto /challenge-bravo.
<abbr> *Passo 2:*</abbr> Rode o comando  `npm install` para baixar as dependências. 
<abbr> *Passo 3:*</abbr> Rode o comando `npm start` para inicializar a aplicação na porta 3000.
Para testar basta rodar esse curl na sua aplicação de preferência. Sugiro [Postman](https://www.getpostman.com/).
Exemplo:
##### Get All currencies 
curl -X GET \
  http://localhost:3000/api/currency \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 330bd52a-e9ef-4a15-8316-a2d5d17536da' \
  -H 'cache-control: no-cache' 
##### Get One currency
curl -X GET \
  http://localhost:3000/api/currency/1243 \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 872e77cf-0bc5-41ae-9ef2-c1796636535a' \
  -H 'cache-control: no-cache' \
  -d '{"currencyName":"BRL"}'
 ##### Update currency 
 curl -X POST \
  http://localhost:3000/api/currency \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: c9292f13-68f2-4500-961b-ccc0f7514a2b' \
  -H 'cache-control: no-cache' \
  -d '{"currencyName":"BRL"}'
  ##### Remove a  currency 
  curl -X DELETE \
  http://localhost:3000/api/currency/5d9404858693a727341b8ebc \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: bf15ffcf-87db-4463-bf75-7d6d3d4a62c0' \
  -H 'cache-control: no-cache'
  
##Tecnologias não utilizadas
Devido o escopo do projeto, algumas tecnologias que o autor domina, não foram utilizadas. Poderia ter utilizado [Jenkins](https://jenkins.io/) como  um servidor de Integração Contínua. Outros poderiam fazer a mesma função com GitLab ou Gocd.
Algumas libraries foram utilizadas para desenvolvimento mas não foram inseridas no projeto. Nodemon, webpack.
Se tivesse mais tempo teria implementado testes para a aplicação em todos seus pacites. Mesmo sabendo da importância dos testes.

###Resultado do teste de carga

ab -n 1000 -c 50  -k localhost:8080/candidate
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 100 requests
Completed 200 requests
Completed 300 requests
Completed 400 requests
Completed 500 requests
Completed 600 requests
Completed 700 requests
Completed 800 requests
Completed 900 requests
Completed 1000 requests
Finished 1000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /api/currency
Document Length:        2 bytes

Concurrency Level:      50
Time taken for tests:   1.087 seconds
Complete requests:      1000
Failed requests:        0
Keep-Alive requests:    1000
Total transferred:      212000 bytes
HTML transferred:       2000 bytes
Requests per second:    920.26 [#/sec] (mean)
Time per request:       54.332 [ms] (mean)
Time per request:       1.087 [ms] (mean, across all concurrent requests)
Transfer rate:          190.52 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   1.4      0      10
Processing:    18   53  99.1     30     514
Waiting:       18   53  99.1     30     514
Total:         18   54 100.2     30     521

Percentage of the requests served within a certain time (ms)
  50%     30
  66%     33
  75%     35
  80%     36
  90%     42
  95%    285
  98%    513
  99%    517
 100%    521 (longest request)


Estou a disposição para qualquer dúvida no e-mail paulohfreitas_ti@hotmail.com.


Construa uma API, que responda JSON, para conversão monetária. Ela deve ter uma moeda de lastro (USD) e fazer conversões entre diferentes moedas com cotações de verdade e atuais.

A API deve, originalmente, converter entre as seguintes moedas:

-   USD
-   BRL
-   EUR
-   BTC
-   ETH

Ex: USD para BRL, USD para BTC, ETH para BRL, etc...

A requisição deve receber como parâmetros: A moeda de origem, o valor a ser convertido e a moeda final.

Ex: `?from=BTC&to=EUR&amount=123.45`

Construa também um endpoint para adicionar e remover moedas suportadas pela API, usando os verbos HTTP.

Você pode usar qualquer linguagem de programação para o desafio. Abaixo a lista de linguagens que nós aqui do HU temos mais afinidade:

-   JavaScript (NodeJS)
-   Python
-   Go
-   Ruby
-   C++
-   PHP

## Requisitos

-   Forkar esse desafio e criar o seu projeto (ou workspace) usando a sua versão desse repositório, tão logo acabe o desafio, submeta um _pull request_.
    -   Caso você tenha algum motivo para não submeter um _pull request_, crie um repositório privado no Github, faça todo desafio na branch **master** e não se esqueça de preencher o arquivo `pull-request.txt`. Tão logo termine seu desenvolvimento, adicione como colaborador o usuário `automator-hurb` no seu repositório e o deixe disponível por pelo menos 30 dias. **Não adicione o `automator-hurb` antes do término do desenvolvimento.**
    -   Caso você tenha algum problema para criar o repositório privado, ao término do desafio preencha o arquivo chamado `pull-request.txt`, comprima a pasta do projeto - incluindo a pasta `.git` - e nos envie por email.
-   O código precisa rodar em macOS ou Ubuntu (preferencialmente como container Docker)
-   Para executar seu código, deve ser preciso apenas rodar os seguintes comandos:
    -   git clone \$seu-fork
    -   cd \$seu-fork
    -   comando para instalar dependências
    -   comando para executar a aplicação
-   A API pode ser escrita com ou sem a ajuda de _frameworks_
    -   Se optar por usar um _framework_ que resulte em _boilerplate code_, assinale no README qual pedaço de código foi escrito por você. Quanto mais código feito por você, mais conteúdo teremos para avaliar.
-   A API precisa suportar um volume de 1000 requisições por segundo em um teste de estresse.

## Critério de avaliação

-   **Organização do código**: Separação de módulos, view e model, back-end e front-end
-   **Clareza**: O README explica de forma resumida qual é o problema e como pode rodar a aplicação?
-   **Assertividade**: A aplicação está fazendo o que é esperado? Se tem algo faltando, o README explica o porquê?
-   **Legibilidade do código** (incluindo comentários)
-   **Segurança**: Existe alguma vulnerabilidade clara?
-   **Cobertura de testes** (Não esperamos cobertura completa)
-   **Histórico de commits** (estrutura e qualidade)
-   **UX**: A interface é de fácil uso e auto-explicativa? A API é intuitiva?
-   **Escolhas técnicas**: A escolha das bibliotecas, banco de dados, arquitetura, etc, é a melhor escolha para a aplicação?

## Dúvidas

Quaisquer dúvidas que você venha a ter, consulte as [_issues_](https://github.com/HurbCom/challenge-bravo/issues) para ver se alguém já não a fez e caso você não ache sua resposta, abra você mesmo uma nova issue!

Boa sorte e boa viagem! ;)

<p align="center">
  <img src="ca.jpg" alt="Challange accepted" />
</p>
