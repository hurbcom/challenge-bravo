require('module-alias/register')
const Server = require('@src/startServer')
const configs = {
    dependencies: {
        express: require('express'),
        logger: require('morgan'),
        cors: require('cors'),
        env: {
            PORT: process.env.PORT || 3000
        }
    },
    routes: require('@src/routes')
}

const server = new Server(configs);

server.start();