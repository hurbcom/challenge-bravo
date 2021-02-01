const awilix = require('awilix');

const ConversionController = require('../controllers/ConversionController');
const CurrencyController = require('../controllers/CurrencyController');
const UpdateConversionRates = require('../jobs/UpdateConversionRates');
const ConversionRepository = require('../repositories/ConversionRepository');
const CurrencyRepository = require('../repositories/CurrencyRepository');
const CoinGeckoService = require('../services/CoinGeckoService');
const ConversionService = require('../services/ConversionService');
const CurrencyService = require('../services/CurrencyService');
const MongoDBConnection = require('./MongoDBConnection');

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
});

function setup() {
    container.register({
        conversionController: awilix.asClass(ConversionController),
        currencyController: awilix.asClass(CurrencyController),
        updateConversionRates: awilix.asClass(UpdateConversionRates),
        conversionRepository: awilix.asClass(ConversionRepository),
        currencyRepository: awilix.asClass(CurrencyRepository),
        coinGeckoService: awilix.asClass(CoinGeckoService),
        conversionService: awilix.asClass(ConversionService),
        currencyService: awilix.asClass(CurrencyService),
        mongoDBConnection: awilix.asValue(MongoDBConnection),
    });
}

module.exports = {
    container,
    setup,
};
