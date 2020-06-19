FROM node:12.2.0-alpine 

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . . 

CMD [ "npm", "run" ,"dev-job" ]