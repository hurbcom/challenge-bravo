const { asFunction, createContainer, asValue } = require('awilix')

// ALphabetical
const app = require('./app')
const config = require('./config')
const logger = require('./shared/services/LoggerService')
const router = require('./config/routes')
const server = require('./config/server')

const container = createContainer();

// ALphabetical
container.register({
    app: asFunction(app).singleton(),
    config: asValue(config),
    logger: asFunction(logger).singleton(),
    router: asFunction(router).singleton(),
    server: asFunction(server).singleton(),
})

module.exports = container;