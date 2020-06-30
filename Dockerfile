FROM node:12

WORKDIR /usr/scr/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3333
CMD ["npm", "start"]