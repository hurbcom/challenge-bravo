FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]


FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY models/ .
COPY workers/ .
COPY .env .
CMD ["node", "workers/currencys.js"]