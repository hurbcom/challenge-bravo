const appConfig = require("../../config/app.config.js");
const cryptoCompareConfig = require("../../config/cryptoCompare.config.js");

const NodeCache = require( "node-cache" );
global.fetch = require('node-fetch')

const cache = new NodeCache();
const cryptoCompareClient = require('cryptocompare')
cryptoCompareClient.setApiKey(cryptoCompareConfig.KEY)

const cryptoCompareForex = class {

  // get all currencies rates
  getRates = () => {
    
    return new Promise((resolve, reject) => { 

      let result = {
        'base': appConfig.CURRENCY_BASE,
        'rates': {}
      };

      // using cache
      let cacheName = 'cryptoCompareRateCache-'+appConfig.CURRENCY_BASE;
      let rateData = cache.get(cacheName);

      if(rateData){
        result['rates'] = rateData;
        resolve(result)
      }

      cryptoCompareClient.priceMulti(['BTC', 'ETH'], [appConfig.CURRENCY_BASE])
        .then(data => {

          // correcting rate for system format
          let processedData = {};
          for(let currencyRow in data)
            processedData[currencyRow] = data[currencyRow][appConfig.CURRENCY_BASE]
  
          // updating cache          
          cache.set(cacheName, processedData, cryptoCompareConfig.TTL);

          result['rates'] = processedData;
          resolve(result)
        })
        .catch(error => reject(error))
    });
  };
};

module.exports = cryptoCompareForex;