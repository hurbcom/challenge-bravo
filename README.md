# Challenge Bravo

[[English](README.md) | [Português](README.pt.md)]

## Solution

I used https://docs.awesomeapi.com.br/api-de-moedas to get the currency quote and based on the data received, perform the calculation for the conversion.

## Frameworks

-   [Django REST Framework](https://www.django-rest-framework.org/): To build the endpoints
-   [PostgreSQL](https://www.postgresql.org/): Database
-   [Docker](https://www.docker.com/): For application container
-   [Heroku](https://www.heroku.com/): To deploy of [staging](https://challenge-bravo-stg.herokuapp.com/) and [production](https://challenge-bravo-prd.herokuapp.com/)

**Production**: https://challenge-bravo-prd.herokuapp.com/  
**Staging**: https://challenge-bravo-stg.herokuapp.com/

## Development

1. Rename the `.env-sample` file to `.env` and set the value of the variables. Add `DEBUG` and `ALLOWED_HOSTS` if necessary.

If it is via Docker, in the terminal run:

```sh
docker compose up
```

If you want to run it through [Pipenv](https://pypi.org/project/pipenv/), in the terminal run:

```sh
# start the virtual environment
pipenv shell

# install the dependencies
pipenv install --system

# realize the migrations
python manage.py migrate

# run application
python manage.py runserver
```

---
