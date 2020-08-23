FROM node:10.22-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY .env /usr/src/app/

COPY . /usr/src/app/

RUN npm set unsafe-perm true
RUN npm run preinstall

RUN npm install

EXPOSE 4000

CMD [ "npm", "run", "start:dev"]