FROM node:latest
WORKDIR /app
RUN npm install
CMD ["npm", "start"]