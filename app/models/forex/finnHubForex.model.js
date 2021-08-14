const appConfig = require("../../config/app.config.js");
const finnHubConfig = require("../../config/finnHub.config.js");

const NodeCache = require( "node-cache" );
const FinnHub = require('finnhub');

const cache = new NodeCache();
const api_key = FinnHub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnHubConfig.KEY;
const finnhubClient = new FinnHub.DefaultApi();

const FinnHubForex = class {

  // get all currencies rates
  getRates = () => {
    
    return new Promise((resolve, reject) => { 

      let result = {
        'base': appConfig.CURRENCY_BASE,
        'rates': {}
      };

      // using cache
      let cacheName = 'finnHubRateCache-'+appConfig.CURRENCY_BASE;
      let rateData = cache.get(cacheName);
      
      if(rateData){
        result['rates'] = rateData;
        resolve(result);
      }

      finnhubClient.forexRates({"base": appConfig.CURRENCY_BASE}, (error, data, response) => {

        if(error)
          reject(error);

        // correcting rate for system format
        let processedData = {};
        for(let currencyRow in data.quote)
            processedData[currencyRow] = 1/data.quote[currencyRow];

        // updating cache
        cache.set(cacheName, processedData, finnHubConfig.TTL);

        result['rates'] = processedData;
        resolve(result);
      });
    });
  };

};

module.exports = FinnHubForex;