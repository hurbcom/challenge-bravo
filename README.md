# <img src="https://avatars1.githubusercontent.com/u/7063040?v=4&s=200.jpg" alt="HU" width="24" /> Desafio Bravo
### Antonio Victor Luckwu Marques
---
### Problema
Desafio de back-end da HURB.
Conversor de moedas. Deve ser possível cadastrar e converter entre moedas reais e fictícias.
A moeda de lastro por padrão é o Dolar (USD).

As tecnologias escolhidas para o desenvolvimento do projeto foram:
- Python 3.8+
- FastAPI
- Peewee ORM
- PostgreSQL
- Sqlite (para testes)

### Dependências
- [poetry](https://python-poetry.org/docs/#installation) - utilizado para gerenciamento de dependências / virtualenv
- [docker-compose](https://docs.docker.com/compose/install/) - utilizado para executar a aplicação

### Como rodar a aplicação
```bash
$ git clone https://github.com/avlm/challenge-bravo
$ cd challenge-bravo
$ poetry install
$ docker-compose up --build
```
O conversor de moedas estará rodando na porta 80 do localhost.
O endpoint principal estará em http://localhost/api/v1/

### Documentação da API
Os endpoints da API são:
- http://localhost/api/v1/coins (para o CRUD de moedas)
- http://localhost/api/v1/coins/convert (para conversão de moedas)

Para uma documentação mais detalhada da API (parâmetros e retornos), com a aplicação rodando acesse http://localhost/docs

### Como rodar os testes
```bash
$ make test
# o comando executado é: TEST_ENV=True poetry run pytest tests --cov --cov-report term-missing
```

### Requirements.txt
O arquivo requirements é gerado pelo poetry com o comando `poetry export` e não deve ser modificado manualmente. Caso deseje incluir alguma dependência, use o poetry e utilize os comandos de exportação que estão no makefile.

- `make export` - Exporta as dependências do projeto (Sem dependências de dev. Requirements padrão do projeto, usado no docker)
- `make export_dev` - Igual ao anterior, porém incluindo as dependencias de desenvolvimento
