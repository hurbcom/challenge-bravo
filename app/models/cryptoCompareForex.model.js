const NodeCache = require( "node-cache" );
const cryptoCompare = require('cryptoCompare');
const appConfig = require("../config/app.config.js");
const cryptoCompareConfig = require("../config/cryptoCompare.config.js");

const rateCache = 'cryptoCompareRateCache';
const cache = new NodeCache();

global.fetch = require('node-fetch')
const cryptoCompareClient = require('cryptocompare')
cryptoCompareClient.setApiKey(cryptoCompareConfig.KEY)

// constructor
const cryptoCompareForex = class {

  getRates = () => {
    
    return new Promise((resolve, reject) => { 
      let rateData = cache.get(rateCache);

      if(rateData)
        resolve(rateData)

      cryptoCompareClient.priceMulti(['BTC', 'ETH'], [appConfig.CURRENCY_BASE])
        .then(data => {

          cache.set(rateCache, data, cryptoCompareConfig.TTL);
          resolve(data)
        })
        .catch(error => reject(error))
    });
  };

  getRate = (currency) => {
    
    return new Promise( (resolve, reject) => { 
      this.getRates()
        .then(data => {

          resolve({
            'currency': currency,
            'base': appConfig.CURRENCY_BASE,
            'rate': data[currency][appConfig.CURRENCY_BASE]
          })
        })
        .catch(error => reject(error));
    });
  };
};

module.exports = cryptoCompareForex;