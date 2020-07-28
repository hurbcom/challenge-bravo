FROM node:12.18.2

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app
EXPOSE ${PORT}
CMD ["npm", "run", "dev"]