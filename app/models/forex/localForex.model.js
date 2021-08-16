const appConfig = require("../../config/app.config.js");
const db = require("../../models");
const Currency = db.currency;

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

const LocalForex = class {

  // get all currencies rates
  getRates = (base) => {
    
    return new Promise((resolve, reject) => { 

      let result = {
        'base': base,
        'rates': {}
      };

      // using cache
      let cacheName = 'localRateCache-'+base;
      let rateData = cache.get(cacheName);
      
      if(rateData){
        result['rates'] = rateData;
        resolve(result);
      }

      Currency.findAll().then(data => {
        
        // correcting rate for system format
        let processedData = {};
        for(let currencyRow in data)
            processedData[data[currencyRow].code] = base.toUpperCase() == 'USD' ? data[currencyRow].usd_value : 0;

        // updating cache
        cache.set(cacheName, processedData, appConfig.TTL);

        result['rates'] = processedData;
        resolve(result);
      })
      .catch(err => reject(err));
    });
  };

};

module.exports = LocalForex;