FROM node:12.13-alpine

WORKDIR /usr/app

COPY package.json .
COPY yarn.lock .

RUN yarn install

EXPOSE 3333

CMD [ "yarn", "start" ]