# Backend image
#
FROM node:12-alpine3.10 as backend

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY ./backend/package*.json .

RUN npm install --silent

COPY ./backend .

RUN npm install -g sequelize-cli

EXPOSE 3000

CMD ["npm", "start"]

# frontend builder
#
FROM node:12-alpine3.10 as frontend-builder

WORKDIR /usr/src/app

COPY ./frontend/package*.json .

RUN npm install --silent

COPY ./frontend .

RUN npm run build

# web server
#
FROM nginx:1.19.10-alpine as ngix-server

COPY --from=frontend-builder /usr/src/app/build /var/www

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]



