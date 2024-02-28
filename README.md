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

## Containers (docker):

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
```shell
docker compose up
```

A ordem de execução será a seguinte:
1. redis
2. mysql
3. worker
4. app (com delay de 10 segundos, para que dê tempo do worker realizar as atualizações)

Para encerramento dos serviços:
```shell
docker compose down
```

Se precisar alterar o fonte, envs, ou algum outro arquivo, para rebuildar os serviços, basta executar o comando abaixo:
```shell
docker compose up --build
```

## API

> [!IMPORTANT]
> É necessário que os containers estejam em execução a partir deste momento

O projeto estará executando na porta padrão 3000.

O endereço padrão para testes:
```
http://localhost:3000/
```

### Documentação 
A documentação da API foi escrita utilizando a [OpenAPI 3.0 Specification](https://swagger.io/docs/specification/about/) e se encontra no endereço:
```
http://localhost:3000/api-docs/
```
ou 

[resume-doc.md](resume-doc.md)

### Observações

Para formatação monetária é utilizado o padrão brasileiro.

Para moedas correntes foi utilzado o padrão de duas casas decimais, exemplo:

```json
{
  "BRL": "R$ 1,00",
  "USD": "US$ 0,20"
}
```

para criptomoedas, utilizamos dez casas decimais:

```json
{
  "BRL": "R$ 1,0000000000",
  "BTC": "BTC 0,0000033427"
}
```
