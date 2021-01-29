require('dotenv').config();
const Server = require('./src/server');

const port = process.env.PORT ? process.env.PORT : 3000;

const server = new Server();
server.run(port);
