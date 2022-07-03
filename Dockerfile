FROM node:16-alpine

WORKDIR /app

#Este comando atualiza todos os pacotes do alpine
RUN apk upgrade

EXPOSE 3000

ENV PORT 3000

COPY . .

RUN yarn

CMD ["yarn", "dev"]