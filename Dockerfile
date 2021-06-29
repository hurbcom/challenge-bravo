# uses alpine for a lighter image
FROM node:15.10.0-alpine

# creates app folder to use as root
RUN mkdir app

# uses /app as the working directory
WORKDIR /app

# creates src and node_modules folders at /app
RUN mkdir src node_modules

# specifies /node_modules as the path for node
ENV NODE_PATH /node_modules

# copies package.json
COPY package.json ./
# generates a package-lock.json for installation purposes
RUN npm i --package-lock-only
# installs all dependencies
RUN npm install

# copies .env file
COPY .env ./

# copies the /src folder
COPY ./src ./src

# generates the build
RUN npm run build

# runs the project
CMD npm start