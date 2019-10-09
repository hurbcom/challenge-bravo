const PORT = 3000;
const HOST = '0.0.0.0';

const bodyParser = require('body-parser');
const express = require('express');
const server = express();

server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

server.listen(process.env.PORT || PORT, HOST);

module.exports = server