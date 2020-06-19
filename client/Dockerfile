FROM node:12.2.0-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]