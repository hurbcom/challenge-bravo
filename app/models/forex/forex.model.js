const appConfig = require("../../config/app.config.js");
const LocalForex = require("./localForex.model.js");
const CryptoCompareForex = require("./cryptoCompareForex.model.js");
const FinnHubForex = require("./finnHubForex.model.js");

// constructor
const Forex = class {

  getCurrencies = () => {
    const cryptoCompareForex = new CryptoCompareForex();
    const finnHubForex = new FinnHubForex();

    let data = [];
    data = data.concat(cryptoCompareForex.getCurrencies(), finnHubForex.getCurrencies());
    return data;
  }

  // get all currencies rates
  getRates = (base) => {
    
    const localForex = new LocalForex();
    const cryptoCompareForex = new CryptoCompareForex();
    const finnHubForex = new FinnHubForex();

    return Promise.all([
        localForex.getRates(base),
        finnHubForex.getRates(base),
        cryptoCompareForex.getRates(base)
      ])
      .then((values) => {

        let data = {...values[0].rates, ...values[1].rates, ...values[2].rates};
        return {
          'base': base,
          'rates': data
        };
      });
  };

  // get currency rate
  getRate = (base, currency) => {
    
    return new Promise( (resolve, reject) => { 
      this.getRates(base)
        .then(data => {

          resolve({
            'currency': currency,
            'base': base,
            'rate': data.rates[currency]
          })
        })
        .catch(error => reject(error));
    });
  };

  // converts from one currency to another
  convertCurrencyValue = (from, to, amount) => {
    
    return Promise.all([
        this.getRate(appConfig.CURRENCY_BASE, from), 
        this.getRate(appConfig.CURRENCY_BASE, to)
      ])
      .then((values) => {

        let fromRate = values[0].rate;
        let toRate = values[1].rate;

        // calculating conversion
        let amountRate = amount * fromRate;
        let convertionResult = amountRate/toRate;

        return {
          'from': from,
          'to': to,
          'amount': amount,
          // 'fromRate': fromRate,
          // 'toRate': toRate,
          // 'amountRate': amountRate,
          'result': convertionResult
        };
      });
  };
};

module.exports = Forex;