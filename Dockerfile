FROM node:alpine
# Setting working directory. All the paths will be relative to WORKDIR
WORKDIR /usr/src/app
# Add bash to docker
RUN apk update && apk add bash
# Install dependencies
COPY package*.json ./
RUN npm install
# Install sequelize-cli for migrations
RUN npm install sequelize-cli --save
# Copying source files
COPY . .

# Run sequelize database migrations
# RUN npx sequelize db:migrate # FAILED ATTEMPT == ERROR: connect ECONNREFUSED 127.0.0.1:5432

# Port
EXPOSE 3000
# Run the app
CMD [ "npm", "start" ]