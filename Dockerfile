FROM node:14.20.1-alpine3.16

WORKDIR /node-app

COPY package.json .

RUN npm install --silent

COPY . .
