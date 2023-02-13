FROM ubuntu:jammy

ARG DEBIAN_FRONTEND=noninteractive
ENV TZ=America/Sao_Paulo

RUN apt update -y && apt install tzdata -y

# CONFIGURA TIMEZONE DO UBUNTU
RUN echo "America/Sao_Paulo" > /etc/timezone   && ln -fs /usr/share/zoneinfo/fuso_horario /etc/localtime   && dpkg-reconfigure -f noninteractive tzdata

RUN apt install php php-mbstring php-curl wget php-xml php-sqlite3 php-mysql php-mysqli composer -y

VOLUME ./challenge-bravo
WORKDIR ./challenge-bravo

RUN phpenmod pdo_mysql

EXPOSE 8000
