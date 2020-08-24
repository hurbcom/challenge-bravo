const { asFunction, createContainer, asValue, asClass } = require('awilix')

// ALphabetical
const app = require('./app')
const config = require('./config')
const logger = require('./currency/infrastructure/logging/LoggerService')
const response = require('./currency/infrastructure/common/response')
const router = require('./config/routes')
const server = require('./config/server')
const database = require('./currency/infrastructure/knex/connection')
const ratesAPI = require('./currency/infrastructure/exchangeRatesAPI')
const redisClient = require('./currency/infrastructure/redis')

// Features
const currencyFeature = require('api/currency')

const container = createContainer();

// ALphabetical
container.register({
    app: asFunction(app).singleton(),
    config: asValue(config),
    currencyConversionService: asFunction(currencyFeature.conversionService).singleton(),
    currencyConversionAppService: asFunction(currencyFeature.conversionAppService).singleton(),
    currencyFeatureRouter: asFunction(currencyFeature.router).singleton(),
    currencyAppService: asFunction(currencyFeature.currencyAppService).singleton(),
    currencyRepository: asFunction(currencyFeature.currencyRepository).singleton(),
    currencyFactory: asFunction(cradle => currencyFeature.currencyFactory),
    database: asFunction(database).singleton(),
    logger: asFunction(logger).singleton(),
    ratesAPI: asFunction(ratesAPI).singleton(),
    response: asFunction(response).singleton(),
    router: asFunction(router).singleton(),
    server: asFunction(server).singleton(),
    redisClient: asFunction(redisClient).singleton()
})

module.exports = container;