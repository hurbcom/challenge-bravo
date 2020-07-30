FROM node:12.18.2

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install --production
EXPOSE ${PORT}

CMD ["node", "./src/app.js"]