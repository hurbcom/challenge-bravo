const { Currency } = require('../../src/app/models');

const currencyUSD = {
  id: 25,
  name: 'Dollar',
  symbol: 'USD',
  rate: 1,
  default: true,
};

const currencyEUR = {
  id: 35,
  name: 'Euro',
  symbol: 'EUR',
  rate: 1.2216,
  default: true,
};

const currencyDoge = {
  id: 45,
  name: 'Doge Coin',
  symbol: 'DOGE',
  rate: 0.346,
  default: true,
};

const insertCurrencies = async (currencies) => {
  await Currency.bulkCreate(currencies.map((currency) => currency));
};

module.exports = {
  currencyUSD,
  currencyEUR,
  currencyDoge,
  insertCurrencies,
};
