FROM node:latest

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --silent --progress=false

COPY . ./

EXPOSE 3000

CMD [ "npm", "start" ] 