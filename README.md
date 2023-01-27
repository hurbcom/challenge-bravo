# Desafio Challenge-Bravo

## Tecnologias utilizadas

1. [Node JS](https://nodejs.org/en/)
2. [Docker](https://www.docker.com/what-docker)
3. [PostgreSql](https://www.postgresql.org/)
4. [Typescript](https://www.typescriptlang.org)
5. [typeorm](https://typeorm.io/)

## Rodando a aplicação

O projeto ultiliza a plataforma [Docker](https://www.docker.com/what-docker) para a configuração de ambiente, afim de evitar problemas de compatibilidade de sistema. Os passos abaixo podem ser seguidos para executar a aplicação usando a plataforma:

1) Instalação do [Docker](https://docs.docker.com/engine/installation/)
2) Instalação do [Docker Compose](https://docs.docker.com/compose/install/)
3) Siga as seguintes etapas:

Crie e inicie os containers dos serviços:

 ```
 docker-compose build
 docker-compose up
 ```

Em outra aba do terminal execute os seguinte comando para o banco de dados:

```
yarn typeorm migration:run

```

Em seguida rode a api localmente executando o comando

```
yarn dev
```

## Endpoints

Esta api conta com quatro endpoints, sendo elas de listagem, criação e conversão de moedas, e uma de seed do banco que irá buscar os dados das principais moedas no endpoint publico da awesome api. [awesomeapi](https://docs.awesomeapi.com.br/api-de-moedas).

Para buscar as informações nessa api externa, crie no Insomnia ou Postman um método PUT com a URL abaixo

```
http://localhost:3333/quotations/update
```

Não é necessário passar nenhuma informação para esse endpoint. Ao fazer isso, a aplicação irá popular o banco com as moedas: BRL, EUR, ETH, BTC (real, euro, ethereum e bitcoin respectivamente)

Todos os outros podem ser utilizados para cadastro, conversão e listagem, seguindo o padrão de dados da model:

```js
Currency {
    name: string;
    code: string;
    ask: string;
}
```

A variável ask serviu para a conversão simples de uma moeda para outra, sendo ela fictícia ou não. Mais informações no final da página da awesomeapi: [link](https://docs.awesomeapi.com.br/api-de-moedas)

Ao terminar de usar os serviços, user o seguinte comando para pará-los:
 ```
 docker-compose down
 ```

## Ponto negativo Awesome API

No cadastro das cotação das moedas, a awesome api não difere numeros decimais e numeros inteiros muito bem, por exemplo o Bitcoin com lastro em dólar será cadastrada como sendo 22.123 (vinte dois mil cento e vinte e três doláres), e o euro será cadastrado com 1.9072 (um dólar e 90 cents). Isso irá gerar divergências na hora da conversão de algumas moedas que foram cadastradas nessa api pela awesome api.