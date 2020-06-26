FROM node:10
RUN mkdir /WORK
WORKDIR /WORK
COPY package.json /WORK
RUN npm install
COPY . /WORK
EXPOSE 3000
CMD ["npm", "start"]
