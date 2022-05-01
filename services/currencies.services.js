const abstractApiServices = require('./abstractApi.services');
const currenciesRepository = require('../repositories/currencies.repository');

exports.getCurrencyRate = async ({ code, rate }) => {
    if (rate !== undefined && rate !== null && rate.toString().trim().length > 0) {
        return rate;
    }
    return abstractApiServices.getExchangeRates()[code];
};

exports.updateCurrenciesRates = async () => {
    const currencies = await currenciesRepository.listCurrencies(true);
    const rates = await abstractApiServices.getExchangeRates();

    currencies.forEach((currency) => {
        // eslint-disable-next-line no-param-reassign
        currency.rate = rates[currency.code] || currency.rate;
    });

    await currenciesRepository.bulkCurrencies(currencies);
};
