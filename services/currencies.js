const https = require('https');
var cacheProvider = require('../cache-provider');


module.exports = Currencies;

function Currencies() {

    let base = 'USD';
    let cryptoCoins = ['btc', 'eth'];
    
    this.loadRates = loadRates;

    return this;

    function loadRates() {
        console.log('*****************************************\nPlease wait while loading currencies...\n');
        getRealCurrencyRates(base, () => {
            getCryptoCurrencyRates(base);
        });
    }

    function getRealCurrencyRates(base, callback) {
        https.get(`https://api.exchangeratesapi.io/latest?base=${base}`, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk });
            resp.on('end', () => {
                rates = JSON.parse(data);
                if (cacheProvider.instance().set('rates', rates, 1000)) {
                    console.log('Traditional coins currencies: OK');
                    callback();
                }
            });
        }).on('error', (error) => { console.log('error - ', error) });
    }

    function getCryptoCurrencyRates(base) {
        let coins = concatCoins(cryptoCoins);
        https.get(`https://min-api.cryptocompare.com/data/price?fsym=${base}&tsyms=${coins}`, (resp) => {
            let data = '';
            resp.on('data', (chunk) => { data += chunk });
            resp.on('end', () => {
                data = JSON.parse(data);
                Object.entries(data).forEach(([key, value]) => {
                    rates.rates[key] = value;
                });
                if (cacheProvider.instance().set('rates', rates, 1000)) {
                    console.log('Crypto coins currencies: OK');
                    console.log('\n******* APLICATION READY TO USE! *******\n\n');
                }
            });
        }).on('error', (error) => { console.log('error - ', error) });
    }

    function concatCoins(coins) {
        let res = '';
        cryptoCoins.forEach((val, idx) => {
            if (idx == 0) {
                res = val.toUpperCase();
                return;
            }
            res += ',' + val.toUpperCase();
        });
        return res;
    }

}