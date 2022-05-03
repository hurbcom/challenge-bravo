const currencyApiServices = require('./currencyApi.services');
const currenciesRepository = require('../repositories/currencies.repository');

exports.getCurrencyRate = async ({ code, rate }) => {
    if (rate !== undefined && rate !== null && rate.toString().trim().length > 0) {
        return rate;
    }
    const rates = await currencyApiServices.getExchangeRates();
    return rates[code];
};

exports.updateCurrenciesRates = async () => {
    const currencies = await currenciesRepository.listCurrencies(true);
    const rates = await currencyApiServices.getExchangeRates();

    currencies.forEach((currency) => {
        // eslint-disable-next-line no-param-reassign
        currency.rate = rates[currency.code] || currency.rate;
    });

    await currenciesRepository.bulkCurrencies(currencies);
};
