# Challenge bravo

Este projeto é uma solução para o desafio explicado no arquivo CHALLENGE.md

Ele foi desenvolvido em [Go](http://golang.org) usando o mínimo de pacotes externos possível e [Mongo](https://www.mongodb.com/) como banco.

Não houve implementação de apis externas para recuperação de taxas de conversão, fiz de maneira simples, com a taxa de conversão sendo guardada no banco no momento da inserção do dado.

## Pré-requisitos

Você precisa ter instalado:

-   [Go](https://golang.org/doc/install) v1.13.4
-   [MongoDb](https://docs.mongodb.com/manual/installation/) v4.2.1

## Instalando e Rodando

A aplicação deverá estar dentro do seu `GOPATH` para funcionar corretamente, mais especificamente dentro da pasta: `$GOPATH/github.com/bispoman/challenge-bravo/`

Para compilar a aplicação, caso necessário, é preciso primeiro instalar todas as dependências, o que pode ser feito usando o seguinte comando a partir da pasta descrita no parágrafo acima:

```
go get ./...
```

Feito isso, basta utilizar o comando `go build` e o programa deverá ser compilado

Antes de rodar a aplicação, certifique-se de que o mongodb esteja rodando em `localhost:27017` que são os parâmetros padrão para a execução do mesmo

Uma vez que o Mongo esteja rodando, você pode usar tanto o compilado que já está no projeto quanto compilar manualmente. Feito isso, basta rodar o binário compilado com o código abaixo:
```
./challenge-bravo
```

## Usando a api

A Api conta com 4 endpoints:

-   /healthcheck
-   /convert
-   /add
-   /delete

### healthcheck

Esse endpoint é um simples endpoint para teste da aplicação.

Exemplo de request:

`GET /api/v1/healthcheck

Resposta:

`Ok`


### convert

Esse endpoint faz a conversão baseado nas taxas presente no banco de dados.

Exemplo de request:
`GET /api/v1/convert?from=USD&to=EUR&amount=1`

Resposta:

`0.625`

### add

Esse endpoint adiciona novas moedas para uso na api.

Exemplo de request:
`POST /api/v1/add`

body:
{
  "name": "AUD",
  "rate": "0.7"
}

Resposta:
`New currency saved`

### delete

Esse endpoint deleta moedas do banco baseado no nome delas.

Exemplo de request:
`DELETE /api/v1/delete?name=EUR`

Resposta:
`Deleted currency`

## Decisões

Escolhi usar Go por ser uma linguagem que gosto bastante de estudar e de usar sempre que possível.
Infelizmente a aplicação não ficou exatamente como eu queria nem como poderia ficar por questões de tempo, acabei só conseguindo trabalhar nela por dois dias. De qualquer forma, creio que ela resolve o problema proposto.

Justamente por conta do tempo, não consegui implementar testes nem uma arquitetura mais rebuscada, acabei optando por fazer algo mais simples no modelo MVC.

Quaisquer dúvidas, fique a vontade para submeter uma issue.
