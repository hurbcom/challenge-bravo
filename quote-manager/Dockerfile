FROM node:16.15.0

EXPOSE 3001

WORKDIR /app

COPY package*.json ./

RUN npm install --silent --progress=false

COPY ./ ./

CMD ["node", "bin/server"]