const NodeCache = require( "node-cache" );
const finnHub = require('finnhub');
const appConfig = require("../config/app.config.js");
const finnHubConfig = require("../config/finnHub.config.js");

const rateCache = 'finnHubRateCache';
const cache = new NodeCache();

const api_key = finnHub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = finnHubConfig.KEY;
const finnhubClient = new finnHub.DefaultApi();

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

        cache.set(rateCache, data.quote, finnHubConfig.TTL);
        resolve(data.quote)
      });
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
        console.log(values, from, to, amount);
      });
  };
};

module.exports = FinnHubForex;