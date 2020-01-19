require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();

function getCriptoCoins(nameCurrency, coins) {
    request(`https://min-api.cryptocompare.com/data/price?fsym=${nameCurrency}&tsyms=${coins}`, function (error, response, body) {
        const currentRate = JSON.parse(body);
        Object.entries(currentRate).forEach(([, value]) => {
            cacheProvider.set(nameCurrency, coins, value);
        });
    });
}

class CurrenciesService {

    constructor() {
        let cryptoCoins = ['BTC', 'ETH'];
        let listOfCoins = ['USD', 'BRL', 'EUR'];

        this.loadRates = loadRates;
        this.scheduleReloadValues = scheduleReloadValues;

        return this;

        function scheduleReloadValues(){
            cacheProvider.set("Data", "Loading", true);
            console.log("Loading a data of currencies  in memory");
            //setRateCoins(base);
            listOfCoins.forEach(function (nameCurrency) {
                setCryptoCurrencyRates(nameCurrency);
                let currencies = listOfCoins.filter(currency => currency !== nameCurrency);
                currencies.forEach(function (to) {
                    setRateCoins(nameCurrency, nameCurrency, to);
                });
            });
            console.log("End loading data");
            cacheProvider.set("Data", "Loading", false);
        }

        function loadRates() {
            cacheProvider.set("Data", "Loading", true);
            console.log("Loading a data of currencies  in memory");
            //setRateCoins(base);
            listOfCoins.forEach(function (nameCurrency) {
                setCryptoCurrencyRates(nameCurrency);
                let currencies = listOfCoins.filter(currency => currency !== nameCurrency);
                currencies.forEach(function (to) {
                    setRateCoins(nameCurrency, nameCurrency, to);
                });
            });
            console.log("End loading data");
            cacheProvider.set("Data", "Loading", false);
        }


        function setRateCoins(nameCurrency, keyName = "base", to = "USD") {
            console.log(`Loading data in memory - Coin: ${keyName}`);

            request('https://api.exchangeratesapi.io/latest?base=' + nameCurrency, function (error, response, body) {
                const currentRate = JSON.parse(body);
                const {rates} = currentRate;
                cacheProvider.set(keyName, to, rates[to]);
            })
        }


        function setCryptoCurrencyRates(nameCurrency) {

            cryptoCoins.forEach(function (coins) {

                let otherCrypto = cryptoCoins.filter(currency => currency !== coins);
                otherCrypto.forEach(function (othercoins) {
                    request(`https://min-api.cryptocompare.com/data/price?fsym=${coins}&tsyms=${othercoins}`, function (error, response, body) {
                        const currentRate = JSON.parse(body);
                        Object.entries(currentRate).forEach(([, value]) => {
                            cacheProvider.set(coins, othercoins, value);
                        });
                    });
                });


                console.log(`Loading a data in memory - cryptocoins ${coins}`);
                getCriptoCoins(nameCurrency, coins);
                getCriptoCoins(coins, nameCurrency);
            });
        }
    }

    getConversionCurrencies(from, to) {

        return cacheProvider.get(from, to);
    }

}

module.exports = CurrenciesService;
