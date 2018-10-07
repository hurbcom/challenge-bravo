FROM node
MAINTAINER Felippe Maurício

COPY . /var/application/current
WORKDIR /var/application/current

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]
