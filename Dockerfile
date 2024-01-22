FROM node

WORKDIR /app

COPY package.json ./

RUN npm install

RUN ulimit -n 65536

COPY . ./

EXPOSE 8082

CMD ["npm", "start"]