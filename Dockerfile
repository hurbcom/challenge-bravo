FROM node:15
WORKDIR /app
COPY package.json .
RUN npm install --quiet
CMD ["npm", "start"]