# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="Hurb" width="24" /> Bravo Challenge

Para esse desafio foi usada a seguinte arquitetura:

<p>
    <img src="./docs/Architecture.png" alt="Architecture" />
</p>

## Diagramas de sequência

### Worker

<p>
    <img src="./docs/Sequence-Worker.png" alt="[UML] Sequence - Worker" />
</p>

### API

<p>
    <img src="./docs/Sequence-API.png" alt="[UML] Sequence - Worker" />
</p>

## Contâiners (docker):

### db

Banco de dados MySQL responsável por persistir os dados em um estado sólido.

### redis

Banco de dados em memória (volátil) que dará melhor desempenho e velocidade em nosso response.

### worker

Serviço responsável por manter o db e o redis sempre atualizados com dados reais. O tempo de atualização default é de 5 minutos, porém esse parâmetro pode ser alterado atualizando o docker-compose.yml

### app

Nosso servidor backend escrito em NodeJS utilizando o framework [ExpressJS](https://expressjs.com/pt-br/).


## Executando o projeto

Para execução do projeto basta executarmos o comando:
```sh
docker compose up
```

A ordem de execução será a seguinte:
1. redis
2. mysql
3. worker
4. app (com delay de 10 segundos, para que dê tempo do worker realizar as atualizações)

Para encerramento dos serviços:
```sh
docker compose down
```

Se precisar alterar o fonte, envs, ou algum outro arquivo, para rebuildar os serviços, basta executar o comando abaixo:
```sh
docker compose up --build
```
