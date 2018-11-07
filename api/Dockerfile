FROM node:8

WORKDIR /usr/src/api

COPY ./package*.json ./

RUN npm install

COPY . .

CMD [ "node", "bin/www" ]