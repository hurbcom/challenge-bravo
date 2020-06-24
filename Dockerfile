FROM node:12-alpine3.12

RUN apk add --no-cache bash

RUN touch /root/.bashrc | echo "PS1='\w\$ '" >> /root/.bashrc

RUN npm install -g typescript ts-node typeorm

WORKDIR /home/node/app