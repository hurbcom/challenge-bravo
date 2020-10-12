const {
  baseValuesFromUSD,
  currencies,
  USD
} = require('../common');

class ExchangeService {

  calculate(from, to, amount) {
    if (!this._hasCurrency(from, to)) {
      return 'Currencies not found';
    }

    if (from == USD) {
      return baseValuesFromUSD[to] * amount;
    }

    if (to == USD) {
      return amount / baseValuesFromUSD[from];
    }

    return (amount / baseValuesFromUSD[from]) * baseValuesFromUSD[to];
  }

  _hasCurrency(from, to) {
    return currencies.includes(from) && currencies.includes(to);
  }
}

module.exports = ExchangeService;