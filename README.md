# Conversão de moedas

API em NodeJS que converte moedas utilizando a API do Crypto Compare (cryptocompare.com).

As tecnologias utilizadas foram:

-   NodeJS (v8.10.0)
    -   consign (v0.1.6)
    -   express (v4.17.1)
    -   redis (v2.8.0)
    -   request (v2.88.0)
-   Redis (v4.0.11)
-   Docker (v18.09.7) e Docker Compose (v1.21.2)

A escolha do NodeJS foi, principalmente, por conta da experiência na tecnologia - agregando em velocidade e facilidade no desenvolvimento.

E também por conta da sua fácil modularização, integração com o Redis e implantação com o Docker.

A escolha pelo Redis se deu pelo fato da quantidade de requisições simultâneas, onde a API poderia falhar e ocasionar erros para o usuário final.

## Iniciar o projeto

Para iniciar o projeto basta digitar o seguinte comando:

```
docker-compose up --build
```

E acessar:

```
http://localhost:3000/api
```

E passar os parametros via querystring (exemplo):

```
?from=USD&to=BRL&amount=1000.00
```

Que irá retornar:

```js
{
"from": "USD",
"to": "BRL",
"amount": "1000.00",
"conversion": "3827.00"
}
```

nota: o valor de 'conversion' é da cotação do dia que estou executando o projeto, podendo ser diferente do dia que você estiver executando

## Teste Unitário

Obtenha o container id com o comando:

```
docker container ls
```

Acesse o container com os comandos:

```
docker exec -it <CONTAINER_ID> /bin/bash
```

No terminal, basta digitar e executar:

```js
npm run test
```

## Teste de Estresse

Obs.: O teste de estresse está configurado para 1000 requisições/segundo por 60 segundos (1000\*60).

Para realizar o teste de estresse, utilizo o Artillery (https://artillery.io/).

Obtenha o container id com o comando:

```
docker container ls
```

Acesse o container com os comandos:

```
docker exec -it <CONTAINER_ID> /bin/bash
```

No terminal, basta digitar e executar:

```js
npm run stress
```
