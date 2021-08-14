const appConfig = require("../../config/app.config.js");
const CryptoCompareForex = require("./cryptoCompareForex.model.js");
const FinnHubForex = require("./finnHubForex.model.js");

// constructor
const Forex = class {

  getRates = () => {
    
    const cryptoCompareForex = new CryptoCompareForex();
    const finnHubForex = new FinnHubForex();

    return Promise.all([
        finnHubForex.getRates(),
        cryptoCompareForex.getRates()
      ])
      .then((values) => {

        let data = {...values[0], ...values[1]};
        return data;
      });
  };

  getRate = (currency) => {
    
    return new Promise( (resolve, reject) => { 
      this.getRates()
        .then(result => {

          resolve({
            'currency': currency,
            'base': appConfig.CURRENCY_BASE,
            'rate': result[currency]
          })
        })
        .catch(error => reject(error));
    });
  };

  convertCurrencyValue = (from, to, amount) => {
    
    return Promise.all([
        this.getRate(from), 
        this.getRate(to)
      ])
      .then((values) => {

        let fromRate = values[0].rate;
        let toRate = values[1].rate;

        let amountRate = amount * fromRate;
        let convertionResult = amountRate/toRate;

        return {
          'from': from,
          'to': to,
          'amount': amount,
          'fromRate': fromRate,
          'toRate': toRate,
          'amountRate': amountRate,
          'result': convertionResult
        };
      });
  };
};

module.exports = Forex;