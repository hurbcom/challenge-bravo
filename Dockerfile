FROM node

EXPOSE 3333

ADD . /api

RUN cd /api && npm install

VOLUME /api/node_modules

WORKDIR /api

CMD ["npm", "start"]