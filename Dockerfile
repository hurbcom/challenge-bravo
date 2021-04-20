FROM node:latest
WORKDIR /app
COPY package.json .
RUN npm install --quiet
CMD ["npm", "start"]