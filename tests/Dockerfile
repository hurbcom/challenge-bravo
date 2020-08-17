FROM python:3.8.5-alpine3.12

LABEL MAINTAINER="Diego Silva de Salles disalles7@gmail.com"

WORKDIR /tests/


RUN apk add --no-cache --virtual build-deps gcc postgresql-dev python3-dev musl-dev  libffi-dev libressl-dev  mariadb-dev 
    
ADD . /tests
ADD ./requirements.txt /tests/requirements.txt

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt;

CMD [ "flask","test"]

