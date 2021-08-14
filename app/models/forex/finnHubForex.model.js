const appConfig = require("../../config/app.config.js");
const finnHubConfig = require("../../config/finnHub.config.js");

const NodeCache = require( "node-cache" );
const FinnHub = require('finnhub');

const rateCache = 'finnHubRateCache';
const cache = new NodeCache();

const api_key = FinnHub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnHubConfig.KEY;
const finnhubClient = new FinnHub.DefaultApi();

// constructor
const FinnHubForex = class {

  getRates = () => {
    
    return new Promise((resolve, reject) => { 
      let rateData = cache.get(rateCache);

      if(rateData)
        resolve(rateData)

      finnhubClient.forexRates({"base": appConfig.CURRENCY_BASE}, (error, data, response) => {

        if(error)
          reject(new Error("Você passou um número ímpar!"));

        let processedData = {};
        for(let currencyRow in data.quote)
            processedData[currencyRow] = 1/data.quote[currencyRow];

        cache.set(rateCache, processedData, finnHubConfig.TTL);
        resolve(processedData)
      });
    });
  };

};

module.exports = FinnHubForex;