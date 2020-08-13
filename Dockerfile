FROM node:latest
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package.json ./
RUN npm install yarn
RUN yarn install
# Copy app source code
COPY ./dist .
#Expose port and start application
EXPOSE 3000
CMD [ "yarn", "start" ]