# Hurb - Challenge Bravo

Este projeto foi criado através do desafio proposto pelo hurb, seu objetivo é fazer conversão monetária entre duas moedas.

## Requisitos
- Node 13 ou mais recente
- npm
- mongo
- [docker-compose](https://docs.docker.com/compose/install) (caso use container)

## Docker Setup

Suba o container:
```sh
docker-compose up -d
```

Configure o banco:
```sh
docker-compose exec node npm run migrate
```

A aplicação estará disponível no endereço: http://localhost:8000.
```sh
# Converção
curl 'http://localhost:8000/currencies?from=USD&to=BRL&amount=30'

# Adicionar Moeda
curl 'http://localhost:8000/currencies' -X 'POST' -d 'currency=CAD&usd_value=0.80'

# Remover Moeda
curl 'http://localhost:8000/currencies/CAD' -X 'DELETE'
```

## Setup

Instale as dependências:

```sh 
npm i
```

Configure o banco:
```sh
npm run migrate
```

## Comandos

Rodar testes:
```sh
npm test
```

Iniciar projeto:
```sh
npm start
```

Configurar/Limpar banco (com as taxas de câmbio atualizadas):
```sh
npm run migrate
```

## Estrutura do Projeto
```
├── database - Arquivos de banco de dados.
│
├── src - Arquivos do sistema.
│   ├── controllers - Controladores do sistema.
│   ├── models - Modelos do sistema.
│   ├── routes - Rotas do sistema.
│   └── services - Classes de serviços para auxiliar na lógica extra.
│
├── sync - Arquivos de sincronização.
|
├── tests - Testes do sistema.
│   ├── API - Testes dos endpoints da API.
│   └── Unit - Testes unitários com componentes do sistema.
```

## Endpoints

```
GET /docs (HTML)
GET /currencies
POST /currencies
DELETE /currencies/{currency}
```

## Informações adicionais
---

#### A atualização das taxas de câmbio está acontecendo de hora em hora, através de um cron configurado dentro do Dockerfile. Não é possível aumentar, pois a API utilizada para consulta é gratuita, e só disponibiliza 1000 requisições por mês. O cálculo feito foi: 1000/31 = 32 requisições por dia (arredondando pra baixo), levando em consideração os testes (que fazem requisição também, 24 requisições por dia seria um número seguro).

---
