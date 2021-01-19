const dotenv = require('dotenv');
const axios = require('axios');
const CurrencyService = require('./CurrencyService');
const CurrencyExchangeService = require('./CurrencyExchangeService');

module.exports = {
   currencyExchangeImport: async () => {
       try {
           const symbols = await CurrencyService.allSymbols();
           let currencyExchanges = [];

           for(symbol of symbols) {
               let params = {};
               const _symbols = CurrencyService.symbolsToString(symbol, symbols);

               params.fsym = symbol;

               if(_symbols) params.tsyms = _symbols;

               const { data: exchangeRates } = await axios.get(process.env.CURRENCY_EXCHANGE_SERVER, {
                   params: params,
                   headers: {
                      authorization: `Apikey ${process.env.API_KEY}`
                   }
               });

               const rates = Object.entries(exchangeRates).map((exchangeRate) => {
                   const [symbol, rate] = exchangeRate;
                   return {symbol: symbol, rate: rate};
               });

               currencyExchanges.push({
                   baseSymbol: symbol,
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