FROM node:lts

WORKDIR '/var/www/app'
COPY ./ ./
RUN npm i
RUN npm run build