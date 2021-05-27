FROM node

WORKDIR /usr/app


RUN npm install

COPY . .

EXPOSE 3333

CMD [ "npm", "run", "dev" ]