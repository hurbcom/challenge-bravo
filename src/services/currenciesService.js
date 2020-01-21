require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();
const criptService = require('./criptoService');
const coinsService = require('./coinsService');


class CurrenciesService {

    async getConversionCurrencies(from, to) {
        if (cacheProvider.get(from, to) == null)
            throw new Error("some unexpected/uncaught async exception");
        return cacheProvider.get(from, to)
    }

    constructor() {
        let cryptoCoins = ['BTC', 'ETH'];
        let listOfCoins = ['USD', 'BRL', 'EUR'];

        this.loadRates = loadRates;
        this.scheduleReloadValues = scheduleReloadValues;

        return this;

        function scheduleReloadValues() {
            console.log("Loading a data of currencies  in memory");
            cacheProvider.get("cripto", 'valid');
            cacheProvider.get("coins", 'valid')


            cacheProvider.get("coins", 'valid').forEach(function (nameCurrency) {
                setCryptoCurrencyRates(nameCurrency);
                let currencies = cacheProvider.get("coins", 'valid').filter(currency => currency !== nameCurrency);
                currencies.forEach(function (to) {
                    setRateCoins(nameCurrency, nameCurrency, to);
                });
            });
            console.log("End loading data");
        }

        async function loadRates() {
            cacheProvider.set("cripto", 'valid', ['BTC', 'ETH',]);
            cacheProvider.set("coins", 'valid', ['USD', 'BRL', 'EUR'])

            console.log("Loading a data of currencies  in memory");
            listOfCoins.forEach(function (nameCurrency) {
                try {
                    setCryptoCurrencyRates(nameCurrency);
                } catch (e) {
                    console.error(e)
                }
                try {
                    let currencies = listOfCoins.filter(currency => currency !== nameCurrency);
                    currencies.forEach(function (to) {
                        setRateCoins(nameCurrency, nameCurrency, to);
                    });
                } catch (e) {
                    console.error(e)
                }
            });
            console.log("End loading data");

            cacheProvider.set("cripto", 'valid', ['BTC', 'ETH',]);
            cacheProvider.set("coins", 'valid', ['USD', 'BRL', 'EUR'])

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("Promise resolvida");
                }, 10);
            });
        }


        function setRateCoins(nameCurrency, keyName = "base", to = "USD") {
            console.log(`Loading data in memory - Coin: ${keyName}`);
            try {
                coinsService.getCurenciesCoins(nameCurrency, keyName, to);
            } catch (e) {
                console.error(e)
            }
        }

        function setCryptoCurrencyRates(firstCurrency) {

            cryptoCoins.forEach(function (secondCurrency) {

                let otherCrypto = cryptoCoins.filter(currency => currency !== secondCurrency);
                otherCrypto.forEach(function (to) {
                    try {
                        criptService.getCriptoCoin(secondCurrency, to);
                    } catch (e) {
                        console.error(e)
                    }
                });

                if (cacheProvider.get("cripto", 'valid').filter(currency => currency === firstCurrency))
                    criptService.getCriptoCoin(firstCurrency, secondCurrency);
                if (cacheProvider.get("cripto", 'valid').filter(currency => currency === secondCurrency))
                    criptService.getCriptoCoin(secondCurrency, firstCurrency);
                console.log(`Loading a data in memory - cryptocoins ${secondCurrency}`);

            });
        }
    }

}

module.exports = CurrenciesService;
