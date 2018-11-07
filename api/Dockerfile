FROM node:8

WORKDIR /usr/src/api

COPY ./package*.json ./

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD [ "node", "bin/www" ]