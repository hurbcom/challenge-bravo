FROM node:8

WORKDIR /usr/src/worker

COPY package*.json ./

ENV NODE_ENV=development

RUN npm install

COPY . .

CMD [ "node", "app.js" ]