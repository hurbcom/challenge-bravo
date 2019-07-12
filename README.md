# Conversão de moedas
API em NodeJS que converte moedas utilizando a API do Crypto Compare (cryptocompare.com)

## Iniciar o projeto
Para iniciar o projeto basta digitar o seguinte comando:

```
docker-compose up -d
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

No terminal, basta acessar a pasta "app" e executar:

```js
npm run test
```

## Teste de Estresse
Obs.: O teste de estresse está configurado para 1000 requisições/segundo por 60 segundos (1000*60).

Para realizar o teste de estresse, utilizo o Artillery (https://artillery.io/).

No terminal, basta acessar a pasta "app" e executar:

```js
npm run stress
```