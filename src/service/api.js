const axios = require('axios');
const CoinService = require('./coinService');
const CoinConvertService = require('./coinExchangeService');
const cache = require('../db/cache');

module.exports = {
   convertImport: async () => {
       try {
           const symbols = await CoinService.allSymbols();

           let coinExchanges = [];

           for(baseSymbol of symbols) {
               let params = {};
               const _symbols = CoinService.symbolsToString(baseSymbol, symbols);

               params.fsym = baseSymbol;

               if(_symbols) params.tsyms = _symbols;

               const { data: exchangeRates } = await axios.get(process.env.COIN_EXCHANGE_API, {
                   params: params
               });

               const rates = Object.entries(exchangeRates).map((exchangeRate) => {
                   const [to, rate] = exchangeRate;
                   return {to: to, rate: rate};
               });

                for(let exchange of rates) {
                   let cacheKey = `${baseSymbol}-${exchange.to}`;
                   await cache.setAsync(cacheKey, exchange.rate);
               } 

               coinExchanges.push({
                   baseSymbol: baseSymbol,
                   rates: rates,
                   createdAt: new Date()
               });
           }

           await CoinConvertService.createMany(coinExchanges);
       } catch(err) {
         console.log(err);
       }
   }
}