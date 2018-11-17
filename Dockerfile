FROM node
MAINTAINER Cleyson Leal

ENV PORT 3000

WORKDIR /app
COPY . .

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]