FROM node

WORKDIR ./src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD "node" "./bin/server.js"