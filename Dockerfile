FROM node:12.18-alpine

ENV NODE_ENV development

WORKDIR /usr/src/chalenge-bravo

COPY .env.example .env

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm i -g nodemon && npm install

COPY . .

RUN npm run knex:migrate && npm run knex:seed

EXPOSE 3333

CMD nodemon src/index.js