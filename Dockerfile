FROM node:12.18.2

COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install --production
EXPOSE 3000

CMD ["node", "./index.js"]