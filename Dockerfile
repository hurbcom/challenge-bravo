FROM node

EXPOSE 3000

ADD . /api

RUN cd /api && npm install

VOLUME /api/node_modules

WORKDIR /api

CMD ["npm", "start"]
