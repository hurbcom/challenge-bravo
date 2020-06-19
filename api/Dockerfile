FROM node:12.2.0-alpine 

RUN mkdir /usr/src/api

WORKDIR /usr/src/api

COPY package*.json ./

RUN npm install

COPY . . 

CMD [ "npm", "run" ,"dev-job" ]