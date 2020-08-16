FROM python:3.8.5-alpine3.12

LABEL MAINTAINER="Diego Silva de Salles disalles7@gmail.com"

WORKDIR /var/www
COPY . /var/www

RUN apk update \
    && apk add --no-cache --virtual build-deps gcc postgresql-dev python3-dev musl-dev  libffi-dev libressl-dev  mariadb-dev 

RUN pip3 install  -r requirements.txt
RUN pip3 install  gunicorn 

RUN chmod +x  docker-entrypoint.sh
RUN chmod +x  docker-entrypoint-dev.sh

EXPOSE 5000






