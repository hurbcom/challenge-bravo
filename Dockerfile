FROM node:10-alpine
# Create app directory
RUN mkdir -p /usr/src/app/node_modules

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy app source code
COPY . .

#Expose port and start application
EXPOSE 3301
CMD [ "npm", "start" ]