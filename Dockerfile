FROM node:latest

ADD . /desafio-bravo/app
WORKDIR /desafio-bravo/app

RUN npm install 

CMD ["npm", "start"]
