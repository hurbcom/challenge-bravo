const appConfig = require("../../config/app.config.js");
const finnHubConfig = require("../../config/finnHub.config.js");

const NodeCache = require( "node-cache" );
const FinnHub = require('finnhub');

const cache = new NodeCache();
const api_key = FinnHub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnHubConfig.KEY;
const finnhubClient = new FinnHub.DefaultApi();

const FinnHubForex = class {

  getCurrencies = () => {
    return ['USD', 'BRL', 'EUR'];
  }

  // get all currencies rates
  getRates = (base) => {
    
    return new Promise((resolve, reject) => { 

      let result = {
        'base': base,
        'rates': {}
      };

      // using cache
      let cacheName = 'finnHubRateCache-'+base;
      let rateData = cache.get(cacheName);
      
      if(rateData){
        result['rates'] = rateData;
        resolve(result);
      }

      finnhubClient.forexRates({"base": base}, (error, data, response) => {

        if(error)
          reject(error);

        // correcting rate for system format
        let processedData = {};
        for(let currencyRow in data.quote){

          if(!this.getCurrencies().includes(currencyRow))
            continue;
          
          processedData[currencyRow] = 1/data.quote[currencyRow];
        }

        // updating cache
        cache.set(cacheName, processedData, appConfig.TTL);

        result['rates'] = processedData;
        resolve(result);
      });
    });
  };

};

module.exports = FinnHubForex;