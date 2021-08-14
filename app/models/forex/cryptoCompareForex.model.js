const cryptoCompareConfig = require("../../config/cryptoCompare.config.js");

const NodeCache = require( "node-cache" );
global.fetch = require('node-fetch')

const cache = new NodeCache();
const cryptoCompareClient = require('cryptocompare')
cryptoCompareClient.setApiKey(cryptoCompareConfig.KEY)

const cryptoCompareForex = class {

  // get all currencies rates
  getRates = (base) => {
    
    return new Promise((resolve, reject) => { 

      let result = {
        'base': base,
        'rates': {}
      };

      // using cache
      let cacheName = 'cryptoCompareRateCache-'+base;
      let rateData = cache.get(cacheName);

      if(rateData){
        result['rates'] = rateData;
        resolve(result)
      }

      cryptoCompareClient.priceMulti(['BTC', 'ETH'], [base])
        .then(data => {

          // correcting rate for system format
          let processedData = {};
          for(let currencyRow in data)
            processedData[currencyRow] = data[currencyRow][base]
  
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