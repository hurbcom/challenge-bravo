FROM node:16-alpine

RUN apk update

ENV PORT=3000

EXPOSE 3000

WORKDIR /app

COPY ./package.json ./yarn.lock /app/

RUN yarn

COPY . .

CMD ["yarn", "dev"]