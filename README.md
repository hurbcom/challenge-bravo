# Challenge Bravo

Construa uma API, que responda JSON, para conversão monetária.

## Projeto

O projeto foi criado com as seguintes tecnologias:

* Node
* Docker
* MongoDB (Banco principal)
* Redis ( Para api externa, em forma de cache)

Alguns pacotes instalados:
- rateLimit (prevenir requisições abusivas acima de 1000 por 1 segundo, do mesmo ip.)
- winston (Logger)
- axios
- nodemon
- express
- cors
- dotenv
- mongoose
- entre outros..

## Executando a API

**Usando Docker**

1- Script de criação das moedas padrão do projeto:
docker-compose run --rm api yarn seed

2 - o script de seed, para o carregamento dos valores a primeira vez :
docker-compose run --rm api yarn load

Após a mensagem de OK, pare o processo e vá para o passo 3.
Os valores são atualizadas de forma automática a cada 15 minutos.

3 - Start no projeto:
docker-compose up api OU  docker-compose up --build

## ENDPOINTS da API

Foi deixado um arquivo yaml,json e txt para ajudar no import no POSTMAN ou Insomnia. Minha preferencia é o Insomnia.

* Convertendo as moedas de acordo com a cotação:
- GET - exchanges CONVERT AMOUNT : 0.0.0.0:3333/exchanges/convert?from=USD&to=BRL&amount=100.00

Conforme a regra do teste : from é a origem , to o destino e amount o valor a ser convertido.

* Deletando uma moeda pela abreviação:
- DEL - COIN : 0.0.0.0:3333/coins/BRL

* Alterando as informações da moeda:
- PUT - COIN : 0.0.0.0:3333/coins/BRL
  {
    "to": "BRL",
    "label": "REAL BRASILEIRO"
  }

* Criando uma nova moeda fora do default
- POST - COIN : 0.0.0.0:3333/coins
   {
    "to": "CNY",
    "label": "Renminbi"
  }
* Listando todas as converções:  
- GET - exchanges : 0.0.0.0:3333/exchanges

* Buscando uma moeda:
- GET - COIN SIGLA :0.0.0.0:3333/coins/BRL

* Listando todas as moedas:
- GET - COIN : 0.0.0.0:3333/coins

Essas são as principais, no arquivo deixado no projeto tem algumas outras rotas testadas.

## Testes

Usando jest.
docker-compose run --rm api yarn test
