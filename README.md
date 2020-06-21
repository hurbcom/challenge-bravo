# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo

---

# Sobre
API para conversão e gerenciamento de moedas. Dada a necessidade de converter entre moedas e cryptos, foram utilizados dois serviços externos para obter as cotações atualizadas: [_cryptoCompare_](https://min-api.cryptocompare.com/) e [_currencyLayer_](https://currencylayer.com/). 

A api foi construida em Nodejs ver 14 utilizando [_restify_](http://restify.com/) como framework de servidor web.

As cotações são cacheadas por até 1 dia em Redis, assim o sistema consegue respoder rapidamente as requisições dos clientes, evitando o round trip até as apis extenas, além de não estrapolar o limite de requisições nas contas dessas apis.

Foi utilizado um redis ao invés de uma cache em memória para garantir que multiplas instâncias da api possuam o mesmo cache de cotações e retornem o mesmo resultado durante a conversão das moedas.

A persistência principal do sistema é feita num banco MySql com acesso direto pela api (sem ORM).

O sistema não permite mais de uma moeda com o mesmo código ISO.

O sistema foi totalmente dockenizado rodando em 3 containers:
 - mysql
 - redis
 - node api

# Tecnologias
As tecnologias utilizadas foram:
- NodeJs
- Restify
- MySql
- Redis
- Docker

# 

# Arquitetura
A api foi construida em 3 camadas para melhorar a manutenabilidade e isolamento de responsabilidades entre os módulos. As 3 camadas são: Controllers, Service e Infra

## Controllers
Está camada é responsável por toda comunicação do servidor HTTP da api. É aqui que é feita toda configuração do web framework restify, além de toda lógica de parsers das requisições, gerenciamento das rotas e parser das respotas de volta para o client.

## Services
Nesta camada se encontra toda lógica de negócio do sistema. Está camada é o foco principal dos testes unitários. É aqui que é feita a conversão das moedas, controle do cache de cotações, chamadas a apis externas e gerenciamento das moedas.

## Infra
Esta camada é responsável pelo acesso aos mecanimos de pesistência utilizados pela api como mysql e redis. Controla toda lógica de conexão com estes sistema, alé do pool de conexões. Responsável por serializar os objetos com os dados de negócio para o devido formato necessário para persistência, JSON para o Redis e queries SQL para o MySql.

# Executando os testes
Para executar os testes unitários, basta instalar as dependências e rodar o mocha. 
1. Faça o clone do projeto https://github.com/ewma18/challenge-bravo
2. ```shell
	$ cd challenge-bravo
	```
3. ```
	$ npm i
	```
4. ```
	$ npm test
	```

# Rodando o Sistema

1. Faça o clone do projeto https://github.com/ewma18/challenge-bravo
2. ```shell
	$ cd challenge-bravo
	```
3. Execute o docker compose para baixar as imagens e subir os containers
	```shell
	$ docker-compose up
	```
	Espere alguns minutos para que o docker baixe todas as imagens e inicialize o mysql corretamente.
	Quando o mysql estiver corretamente inicializado, a linha abaixo deve aparecer no log:
	```
	/usr/sbin/mysqld: ready for connections. Version: '8.0.20'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL.
	```
Nesse momento a api estará dispoível na porta 9090.
Para testar se o sistema está mesmo disponível podemos usar o curl.
``` shell
$ curl -v http://localhost:9090/heartbeat/isAlive
*   Trying 127.0.0.1:9090...
* TCP_NODELAY set
* Connected to localhost (127.0.0.1) port 9090 (#0)
> GET /heartbeat/isAlive HTTP/1.1
> Host: localhost:9090
> User-Agent: curl/7.65.3
> Accept: */*
> 
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Server: Currencies-Api
< Connection: Keep-Alive
< Date: Sun, 21 Jun 2020 22:20:13 GMT
< Request-Id: 92d03dc1-56f3-428f-9ec2-1859b364656b
< Response-Time: 2
< Transfer-Encoding: chunked
< 
* Connection #0 to host localhost left intact

```

# Executando os testes de carga
O sistema foi testado utilizando a ferramenta [_artillery_](https://artillery.io/)
Para rodar o teste de carga é preciso primeiro garantir que os containers estejam rodando corretamente e que as dependências do projeto já tenham sido instaldas.
Em seguida basta rodar o comando abaixo:
```shell
$ npm run load-test
```
O teste é composto por 3 fases:

### **Warm-up**
Nesta fase, que dura 10 segundos, 1 usuário por segundo é adicionado ao teste.

### **Ramp up load**
Nesta fase, que dura 20 segundos, o sistema vai automaticamente adicionando usuários até atingir o valor de 500 usuários/seg

### **Sustained max load**
Nesta fase, que dura 60 segundos, o sistema adiciona 250 usuários por segundo até um máaximo de 1000 usuários simultêneos.

Em todas as fases, cada usuário executa 10 chamadas ao endpoint:
```
/exchange/convert?from=USD&to=BRL&amount=10.56
```

</br>
</br>
</br>

---

# Documentação da API

### Conversão de moedas
``` http
GET /exchange/convert?from={from}&to={to}&amount={amount}
```
Onde:
 - **from**: Código ISO da moeda de origem
 - **to**: código ISO da moeda de destino
 - **amount**: Quantidade da moeda de origem a ser convertida

**Atenção:**
Apenas moedas previamente cadastradas podem ser utilizadas.

ex:
``` http
GET /exchange/convert?from=BRL&to=USD&amount=10
```
Converte 10 BRL para USD.

Formato da Resposta (JSON)
``` json
{
    "originalCurrency": "BRL",
    "originalAmount": "10",
    "convertedCurrency": "USD",
    "convertedAmount": 1.882
}
```
---

### Recupera uma moeda previamente cadastrada
``` http
GET /currency/{id}
```
Onde:
 - **id**: Identificador da moeda

ex:
``` http
GET /currency/1
```
Recupera as informações da moeda cujo identificador é 1

Formato da Resposta (JSON)
``` json
{
    "id": 1,
    "description": "Dollar Americano",
    "isoCode": "USD"
}
```

---

### Apaga uma moeda previamente cadastrada
``` http
DELETE /currency/{id}
```
Onde:
 - **id**: Identificador da moeda

ex:
``` http
DELETE /currency/1
```
Remove a moeda cujo identificador é 1

Formato da Resposta
``` http
200 OK
```
---

### Atualiza uma moeda previamente cadastrada
``` http
PUT /currency/{id}
```
Onde:
 - **id**: Identificador da moeda

ex:
``` http
PUT /currency/1
BODY 
{
    "isoCode": "BLL",
    "description": "peso argentino"
}
```
Atualiza a moeda cujo identificador é 1 com as informações providas no body

Formato da Resposta (JSON)
``` json
{
    "id": "1",
    "isoCode": "BLL",
    "description": "peso argentino"
}
```

---

### Registra uma moeda
``` http
POST /currency
```

ex:
``` http
POST /currency/
BODY 
{
    "isoCode": "ARS",
    "description": "Peso argentino"
}
```
Formato da Resposta (JSON)
``` json
{
    "id": "7",
    "isoCode": "ARS",
    "description": "Peso argentino"
}
```

---