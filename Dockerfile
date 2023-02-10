FROM ubuntu:jammy

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/Sao_Paulo

RUN apt update -y && apt install tzdata -y

# CONFIGURA TIMEZONE DO UBUNTU
RUN echo "America/Sao_Paulo" > /etc/timezone   && ln -fs /usr/share/zoneinfo/fuso_horario /etc/localtime   && dpkg-reconfigure -f noninteractive tzdata

RUN apt install php php-mbstring php-curl php-xml php-sqlite3 composer -y

COPY . ./challenge-brave

WORKDIR ./challenge-brave/challenge-bravo

RUN composer install
RUN php artisan key:generate
RUN php artisan migrate

ENV PATH=$PATH:/usr/bin/php

CMD cd /challenge-brave/challenge-bravo/ && php artisan serve --host=0.0.0.0 --port=8000

EXPOSE 8000
