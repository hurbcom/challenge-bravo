FROM node:8

WORKDIR /usr/src/worker

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "app.js" ]