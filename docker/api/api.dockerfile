FROM node:8.10.0

ARG ENV=development
ARG HOST_UID=1000

ENV ENV=${ENV}

# Copiando scripts necessários para dentro da imagem.
COPY ./docker/api/docker-entrypoint.sh /docker/docker-entrypoint.sh

# Permissão de execução para os scripts
RUN chmod +x /docker/*.sh

# Remove o usuário node que já vem na máquina e o substitui pelo o do desenvolvedor
# que utiliza UID e GID da máquina host do desenvolvedor para que não
# haja problemas de permissão durante o desenvolvimento

RUN deluser --remove-home node; \
    useradd -u ${HOST_UID} -g www-data --shell /bin/bash --create-home dev

RUN mkdir /home/dev/.npm-global ; \
    chown -R dev /home/dev/.npm-global
ENV PATH=/home/dev/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/dev/.npm-global

# Copiando arquivos da API
RUN mkdir /usr/src/app
COPY ./app /usr/src/app
RUN chown -R dev:www-data /usr/src/

WORKDIR /usr/src/app

# Os comandos a partir daqui, como também os que forem executados dentro de um
# container irão utilizar este usuário
USER dev

# Instala pacotes globais
RUN npm install -g pm2
RUN npm install

VOLUME /usr/src/app
EXPOSE 3000

# script que será que executado sempre na execução do container.
CMD ["/docker/docker-entrypoint.sh"]