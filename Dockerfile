FROM node:20.14.0

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]