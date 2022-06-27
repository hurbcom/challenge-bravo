# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)

API para conversão monetária.

## Conteúdo

- [Resumo](#resumo)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Decisões](#decisões)
- [Como usar](#como-usar)
- [Endpoints](#endpoints)
- [Testes](#testes)
- [Melhorias futuras](#melhorias-futuras)

## Resumo

Esta API permite que você realize conversões entre diferentes moedas com **cotações reais e atuais**.

Inicialmente, as moedas suportadas para conversão são USD, BRL, EUR, BTC e ETH.

Outras moedas podem ser adicionadas com uso. Além de moedas reais (FIAT e crypto) você também pode criar moedas fictícias.

## Tecnologias

- Docker 20.10.14
- NodeJS 17.9.1
- Koa 2.13.4
- Yarn 1.22.19
- Redis 7.0.2
- Prettier 2.7.1

## Arquitetura

<img src="https://i.imgur.com/2jNenlb.png" width="700" title="source: imgur.com" />

## Endpoints

As endpoints da API estão documentadas [aqui](./Endpoints.md).
