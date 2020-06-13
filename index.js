require('module-alias/register')
const Server = require('@src/startServer')
const configs = {
    dependencies: {
        express: require('express'),
        logger: require('morgan'),
        cors: require('cors'),
        bodyParser: require('body-parser'),
        env: { PORT: process.env.PORT || 3333 },
        swaggerUi: require('swagger-ui-express'),
    },
    routes: require('@src/routes'),
}

const server = new Server(configs)

server.start()
