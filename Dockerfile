FROM node:14.20.1

WORKDIR /node-app

COPY package*.json .

RUN npm install

RUN npm install nodemon -g

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
