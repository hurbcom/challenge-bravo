FROM node:14-alpine as base
# Create app directory
WORKDIR /usr/app
COPY ./src ./src/
COPY .env ./
# package + lock
COPY package*.json ./
RUN npm ci --only=production

FROM base as webserver
EXPOSE 8080
CMD [ "npm", "run", "start"]

FROM base as cronjob
CMD [ "npm", "run", "start-job"]