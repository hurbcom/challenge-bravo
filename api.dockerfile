FROM node:8.10.0

ENV ENV = ${ENV}

# Copiando arquivos da API
RUN mkdir /usr/src/app
COPY ./app /usr/src/app

WORKDIR /usr/src/app

# Instala pacotes globais
RUN npm install -g pm2
RUN npm install

CMD [ "pm2-runtime", "server.config.js" ]