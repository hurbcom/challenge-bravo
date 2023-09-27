FROM node:18.16.0-slim

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000

#CMD ["npm", "run", "dev"]

CMD [ "tail", "-f", "/dev/null" ]

