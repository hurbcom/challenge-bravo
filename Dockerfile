FROM node:10
WORKDIR /Users/desenv/Projects/challenge-bravo
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]