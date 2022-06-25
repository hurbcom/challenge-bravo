FROM node:16.14.2

ARG PORT_BUILD=4040

WORKDIR /usr/app

COPY . .

RUN npm install

EXPOSE ${PORT_BUILD}

ENV PORT = ${PORT_BUILD}

CMD [ "npm", "start"] 