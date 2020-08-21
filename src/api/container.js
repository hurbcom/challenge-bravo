const { asFunction, createContainer, asValue } = require('awilix')

// ALphabetical
const app = require('./app')
const config = require('./config')
const logger = require('./currency/infrastructure/logging/LoggerService')
const response = require('./currency/infrastructure/common/response')
const router = require('./config/routes')
const server = require('./config/server')

const currencyFeature = require('api/currency')

const container = createContainer();

// ALphabetical
container.register({
    app: asFunction(app).singleton(),
    config: asValue(config),
    currencyFeatureRouter: asFunction(currencyFeature.router).singleton(),
    currencyConversionAppService: asFunction(currencyFeature.conversionAppService).singleton(),
    logger: asFunction(logger).singleton(),
    router: asFunction(router).singleton(),
    response: asFunction(response).singleton(),
    server: asFunction(server).singleton(),
})

module.exports = container;