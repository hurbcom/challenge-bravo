FROM node:12.2.0-alpine

RUN mkdir -p /usr/src/client

WORKDIR /usr/src/client

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]