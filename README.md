# Bem vindo :) - Challenge Bravo

Segue a solução para o [Challenge Bravo](https://github.com/hurbcom/challenge-bravo) desenvolvida com [Node.js](nodejs.org) utilizando a **API** de cotações da [Open Exchange Rates](https://openexchangerates.org).

## Requisitos

- API Key da [openexchangerates](https://openexchangerates.org).
- [Docker](https://www.docker.com/) versão 18.x
- [Docker Compose](https://docs.docker.com/compose/) versão 1.22+

## Iniciando

    $ git clone 
    $ cd challenge-bravo/
    $ echo .env > API_KEY_OEX=<sua chave aqui, apenas numeros>
    $ docker-compose up -d 

### Utilizando a API
GET Request
```
http://localhost:3000/converter?from=BRL&to=ETH&amount=10
```
Response 

    
	{
	    "from": "BRL",
	    "to": "ETH",
	    "amount": 10,
	    "result": 0.012122772371989152
	}
	

## Arquitetura
![arquitetura](http://i66.tinypic.com/2lia63o.jpg)

 

 **Worker**
Responsável por buscar os dados da Open Exchange Rates

**API**
Responsável por disponibilizar rota convert para conversão entre cotações

**Load Balancer & Servidor Escalável**
A solução desenvolvida está preparada para ser escalada. Podendo utilizar tanto serviços como AutoScaling e LoadBalancer da AWS e/ou o Swarm do próprio docker.

**Redis**