const appConfig = require("../../config/app.config.js");
const CryptoCompareForex = require("./cryptoCompareForex.model.js");
const FinnHubForex = require("./finnHubForex.model.js");

// constructor
const Forex = class {

  // get all currencies rates
  getRates = () => {
    
    const cryptoCompareForex = new CryptoCompareForex();
    const finnHubForex = new FinnHubForex();

    return Promise.all([
        finnHubForex.getRates(),
        cryptoCompareForex.getRates()
      ])
      .then((values) => {

        let data = {...values[0].rates, ...values[1].rates};
        return {
          'base': appConfig.CURRENCY_BASE,
          'rates': data
        };
      });
  };

  // get currency rate
  getRate = (currency) => {
    
    return new Promise( (resolve, reject) => { 
      this.getRates()
        .then(data => {

          resolve({
            'currency': currency,
            'base': data.base,
            'rate': data.rates[currency]
          })
        })
        .catch(error => reject(error));
    });
  };

  // converts from one currency to another
  convertCurrencyValue = (from, to, amount) => {
    
    return Promise.all([
        this.getRate(from), 
        this.getRate(to)
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