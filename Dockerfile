FROM node:18.16.0-slim

WORKDIR /home/node/app

COPY package*.json .

RUN npm ci

COPY . .

COPY --chown=root ./entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 3003

#"seed": "seed -u mongodb://mongo:27017/test src/infra/data/seeds"