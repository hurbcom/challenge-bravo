FROM node:16-alpine

RUN apk update

COPY . . 

RUN npm install

ENTRYPOINT ["npm", "run", "start"]