/**
 * Arquivo: server.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por iniciar o servidor  
 * Data: 30/11/2018
 */ 

'use strict'

const config = require("./config")
const app = require("./src/app");
const port = config.express.port;

const server = require('http').createServer(app);

server.listen(port, () => {
    console.log('Server running on the port: ' + port);
}); 
