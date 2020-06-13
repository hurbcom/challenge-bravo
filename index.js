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
        scheduler: require('@utils/scheduler'),
    },
    routes: require('@src/routes'),
}

const server = new Server(configs)
const updateValueCoins = require('./src/jobs/update-value-coins')
if (process.env.JOB) {
    server.scheduleJob(1000 * 60, updateValueCoins, true)
}

server.start()
