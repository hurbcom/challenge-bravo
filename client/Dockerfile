FROM node:12.2.0-alpine

RUN mkdir /usr/src/client

WORKDIR /usr/src/client

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "serve"]