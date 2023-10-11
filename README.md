
# API de Conversão Monetária

Esta é uma API Rest que permite a conversão de diferentes moedas, incluindo moedas fiduciárias, criptomoedas e moedas fictícias. Ela utiliza cotações de moedas reais e atuais para efetuar as conversões. Além disso, oferece a funcionalidade de adicionar e remover moedas suportadas pela API.

Esta API resolve é a necessidade de converter valores monetários entre diversas moedas, incluindo moedas convencionais como USD, BRL, EUR, moedas criptográficas como BTC e ETH, bem como moedas fictícias, como Peça de Ouro (D&D) e GTA$.

## Moedas Suportadas

As moedas suportadas pela API por padrão são:

EUR<br>
BRL<br>
BTC<br>
ETH

Todas as moedas têm seus valores de referência em USD.

## Tecnologias

Node.js<br>
ExpressJS<br>
Redis<br>
Joi<br>
MongoDB<br>
Swagger<br>
Vitest<br>
Docker e Docker Compose<br>

## Documentação

Toda documentação dos endpoints foi feita com swagger

## Rodando o projeto

Para executar o projeto vai precisar ter o **docker e o docker compose** instalados na na sua máquina

### Clone o projeto em sua máquina e entre no diretório

```bash
git clone https://github.com/mtts021/challenge-bravo.git

cd challenge-bravo
```

### suba os containers

```bash
docker compose up -d
```

### Entre no container do Node.js com o comando

```bash
docker compose exec app bash
```

### Dentro do container, instale as dependências do projeto

```bash
npm ci
```

### Rode os testes

```bash
npm test
```

### Rode a aplicação

```bash
npm run start
```

## Documentação

- ### A API é documentada utilizando o swagger e, com o projeto rodando, será possível verificá-lo em <http://localhost:3000/api-docs/>
