FROM node:12.2.0-alpine 

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

RUN npm install -g nodemon --quiet

EXPOSE 3333

CMD [ "npm", "run" ,"dev-job" ]