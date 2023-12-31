FROM node:16

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
RUN docker run -p 6379:6379 -it redis/redis-stack-server:latest

COPY . .
COPY --chown=node:node . .
USER node
EXPOSE 3003

CMD [ "npm", "run", "start:dev" ]