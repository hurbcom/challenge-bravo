FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . ./

EXPOSE 8082

CMD ["npm", "start"]