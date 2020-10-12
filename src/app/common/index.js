const USD = 'USD';
const BRL = 'BRL';
const EUR = 'EUR';
const BTC = 'BTC';
const ETH = 'ETH';

const baseValuesFromUSD = {
  BRL: 5.53,
  EUR: 0.85,
  BTC: 0.000086,
  ETH: 0.0026,
  USD: 1
};

const currencies = [USD, BRL, EUR, BTC, ETH];

module.exports = {
  currencies,
  baseValuesFromUSD,
  USD,
  BRL,
  EUR,
  BTC,
  ETH
};