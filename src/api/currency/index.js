const router = require('./application/routes')
const conversionAppService = require('./application/impl/ConversionAppService')
const currencyAppService = require('./application/impl/CurrencyAppService')
const currencyRepository = require('./domain/repositories/CurrencyRepository')
const conversionService = require('./domain/services/ConversionService')

module.exports = {
    router,
    conversionAppService,
    conversionService,
    currencyAppService,
    currencyRepository
}