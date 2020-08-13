FROM python:3.7

LABEL MAINTAINER="Diego Silva de Salles disalles7@gmail.com"

ENV GROUP_ID=1000 \
    USER_ID=1000


WORKDIR /var/www/

ADD . /var/www/
ADD ./requirements.txt /var/www/requirements.txt

RUN  pip3 install --upgrade pip
RUN  pip3 install -r requirements.txt
RUN  pip3 install gunicorn

RUN chmod +x docker-entrypoint.sh
RUN chmod +x docker-entrypoint-dev.sh

EXPOSE 5000