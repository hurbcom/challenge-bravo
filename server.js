/**
 * Arquivo: server.js
 * Author: Fernanda Souza
 * Descrição: arquivo responsável por setar as configurações iniciais do app
 * Data: 30/11/2017
 */ 

'use strict'

const config = require("./config")
const app = require("./src/app");
const port = normalizePort(config.express.port);

const server = require('http').createServer(app);

server.listen(port, () => {
    console.log('Server running on the port: ' + port);
}); 

server.on('error', onError);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) return val;

    if (port >= 0) return port;

    return false;

}

function onError(error) {

    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === "string" ?
        'Pipe ' + port :
        'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevanted privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in user');
            process.exit(1);
            break;
        default:
            throw error;
    }

}