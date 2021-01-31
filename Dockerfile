FROM node:14-alpine

WORKDIR /app

COPY . .
RUN npm i

CMD [ "npm", "run", "start" ]