const appConfig = require("../../config/app.config.js");
const cryptoCompareConfig = require("../../config/cryptoCompare.config.js");

const NodeCache = require( "node-cache" );
global.fetch = require('node-fetch')

const rateCache = 'cryptoCompareRateCache';
const cache = new NodeCache();


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

          let processedData = {};
          for(let currencyRow in data)
            processedData[currencyRow] = data[currencyRow][appConfig.CURRENCY_BASE]
          
          cache.set(rateCache, processedData, cryptoCompareConfig.TTL);
          resolve(processedData)
        })
        .catch(error => reject(error))
    });
  };
};

module.exports = cryptoCompareForex;