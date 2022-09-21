FROM node:lts

WORKDIR /usr

COPY . .

EXPOSE 5000

RUN npm i