FROM node:12.18-alpine 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 3333

CMD [ "npm", "run" ,"dev-job" ]