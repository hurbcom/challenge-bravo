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

    async getConversionCurrencies(from, to) {
        return cacheProvider.get(from, to);
    }

    constructor() {
        let cryptoCoins = ['BTC', 'ETH'];
        let listOfCoins = ['USD', 'BRL', 'EUR'];

        this.loadRates = loadRates;


        return this;

        function scheduleReloadValues(){
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
        }

        async function loadRates() {
            console.log("Loading a data of currencies  in memory");
            //setRateCoins(base);
            listOfCoins.forEach(function (nameCurrency) {
                try {
                     setCryptoCurrencyRates(nameCurrency);
                }
                catch (e) {
                    console.error(e)
                }
                try {
                    let currencies = listOfCoins.filter(currency => currency !== nameCurrency);
                    currencies.forEach(function (to) {
                          setRateCoins(nameCurrency, nameCurrency, to);
                    });
                }
                catch (e) {
                    console.error(e)
                }
            });
            console.log("End loading data");
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("Promise resolvida");
                }, 10);
            });
        }


        function setRateCoins(nameCurrency, keyName = "base", to = "USD") {
            console.log(`Loading data in memory - Coin: ${keyName}`);
            try {
                request('https://api.exchangeratesapi.io/latest?base=' + nameCurrency, function (error, response, body) {
                    const currentRate = JSON.parse(body);
                    const {rates} = currentRate;
                    cacheProvider.set(keyName, to, rates[to]);
                })
            }
            catch (e) {
                console.error(e)
            }
        }


         function setCryptoCurrencyRates(nameCurrency) {

            cryptoCoins.forEach(function (coins) {

                let otherCrypto = cryptoCoins.filter(currency => currency !== coins);
                otherCrypto.forEach(function (othercoins) {
                    try{
                        request(`https://min-api.cryptocompare.com/data/price?fsym=${coins}&tsyms=${othercoins}`, function (error, response, body) {
                            const currentRate = JSON.parse(body);
                            Object.entries(currentRate).forEach(([, value]) => {
                                cacheProvider.set(coins, othercoins, value);
                            });
                        });
                    }
                    catch (e) {
                        console.error(e)
                    }
                });


                console.log(`Loading a data in memory - cryptocoins ${coins}`);
                getCriptoCoins(nameCurrency, coins);
                getCriptoCoins(coins, nameCurrency);
            });
        }
    }

}

module.exports = CurrenciesService;
