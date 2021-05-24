const axios = require('axios');
const currencyService = require('../services/currency.service');
const config = require('../../config/config');

const updateCurrency = async (dataCurrency) => {
  const { rate } = dataCurrency;
  await currencyService.updateBySymbol(dataCurrency.symbol, { rate });
};

const consultCurrenciesAPI = async (currencies) => {
  const url = `${config.api_currency_convert}/json/last/${currencies}`;
  const response = await axios.get(url);
  Object.keys(response.data).forEach(function (key) {
    const currency = response.data[key];

    updateCurrency({
      symbol: currency.code,
      rate: currency.bid,
    });
  });
};

const run = async () => {
  const currencies = await currencyService.getStandardCurrencies();
  const currenciesSearch = currencies
    .map((currency) => {
      if (currency.symbol === config.currency_rate_name) {
        return null;
      }

      return `${currency.symbol}-${config.currency_rate_name}`;
    })
    .filter((el) => el !== null);

  consultCurrenciesAPI(currenciesSearch);
};

module.exports = {
  run,
};
