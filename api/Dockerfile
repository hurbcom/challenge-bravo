FROM node:12.2.0-alpine 

WORKDIR /api

COPY package*.json ./

RUN npm install

COPY . . 

CMD [ "npm", "run" ,"dev-job" ]