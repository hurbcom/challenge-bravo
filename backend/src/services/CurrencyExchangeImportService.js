const dotenv = require('dotenv');
const axios = require('axios');
const CurrencyService = require('./CurrencyService');
const CurrencyExchangeService = require('./CurrencyExchangeService');
const cacheClient = require('../../lib/cache_client');

module.exports = {
   currencyExchangeImport: async () => {
       try {
           const symbols = await CurrencyService.allSymbols();

           let currencyExchanges = [];

           for(baseSymbol of symbols) {
               let params = {};
               const _symbols = CurrencyService.symbolsToString(baseSymbol, symbols);

               params.fsym = baseSymbol;

               if(_symbols) params.tsyms = _symbols;

               const { data: exchangeRates } = await axios.get(process.env.CURRENCY_EXCHANGE_SERVER, {
                   params: params
               });

               const rates = Object.entries(exchangeRates).map((exchangeRate) => {
                   const [symbol, rate] = exchangeRate;
                   return {symbol: symbol, rate: rate};
               });

               for(let exchange of rates) {
                   let cacheKey = `${baseSymbol}-${exchange.symbol}`;
                   await cacheClient.setAsync(cacheKey, exchange.rate);
               }

               currencyExchanges.push({
                   baseSymbol: baseSymbol,
                   rates: rates,
                   createdAt: new Date()
               });
           }

           await CurrencyExchangeService.createMany(currencyExchanges);
       } catch(err) {
         console.log(err);
       }
   }
}