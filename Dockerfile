# Installs Node 12 Image
FROM node:12-alpine

# Sets the work direction for /app
WORKDIR /app

# Copy files to the image
COPY . .

# Installs the application for production
RUN npm ci --production

# Exposes the image on port 8080
EXPOSE 8080

# Executes the start command
CMD ["npm", "start"]
