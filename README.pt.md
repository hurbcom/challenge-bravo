# Challenge Bravo

[[English](README.md) | [Português](README.pt.md)]

## Solução

Utilizei https://docs.awesomeapi.com.br/api-de-moedas para buscar a cotação das moedas e a partir dos dados recebidos realizar o cálculo para a conversão.

## Frameworks

-   [Django REST Framework](https://www.django-rest-framework.org/): Para construção dos endpoints
-   [PostgreSQL](https://www.postgresql.org/): Banco de dados
-   [Docker](https://www.docker.com/): Para container da aplicação
-   [Heroku](https://www.heroku.com/): Para deploy de [staging](https://challenge-bravo-stg.herokuapp.com/) e [produção](https://challenge-bravo-prd.herokuapp.com/)

**Produção**: https://challenge-bravo-prd.herokuapp.com/  
**Staging**: https://challenge-bravo-stg.herokuapp.com/

## Desenvolvimento

1. Renomear o arquivo `.env-sample` para `.env` e definir a valor das variáveis. Adicionar `DEBUG` e `ALLOWED_HOSTS` se necessário.

Caso seja via Docker, no terminal executar:

```sh
docker compose up
```

Caso queira executar através do [Pipenv](https://pypi.org/project/pipenv/), no terminal executar:

```sh
# iniciar o ambiente virtual
pipenv shell

# instalar as dependências
pipenv install --system

# realizar as migrações
python manage.py migrate

# executar a aplicação
python manage.py runserver
```

---
