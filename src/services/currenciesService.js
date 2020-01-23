require('express');
const request = require("request"), cacheProvider = require('./cacheService').instance();
const criptService = require('./criptoService');
const coinsService = require('./coinsService');
var BigNumbers = require('big-numbers');

let base = "USD"

class CurrenciesService {
     formatNumber (value){
         var numbers = new BigNumbers();
         var number = numbers.of(value);
         return numbers.format(number)
    }

    async getConversionCurrencies(from, to, amount) {
        amount = this.formatNumber(amount);

        let ratesFrom = this.formatNumber(cacheProvider.get('Rates', from));
        let ratesTo = this.formatNumber(cacheProvider.get('Rates', to));
        console.log(ratesTo)
        if (ratesFrom == null || ratesTo == null)
            throw new Error("some unexpected/uncaught async exception");
        if (from == base) return this.formatNumber(amount * ratesTo);
        if (to == base) return this.formatNumber(amount / ratesFrom);
        return this.formatNumber(amount / ratesFrom * ratesTo);
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
            cacheProvider.set("Rates", 'base', base)


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
                    setCryptoCurrencyRates(base);
                } catch (e) {
                    console.error(e)
                }
                try {
                    listOfCoins.forEach(function (to) {
                        setRateCoins("Rates", base, to);
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


        function setRateCoins(nameCurrency, keyName, to) {
            console.log(`Loading data in memory - Coin: ${keyName}`);
            try {
                coinsService.getCurenciesCoins("Rates", keyName, to);
            } catch (e) {
                console.error(e)
            }
        }

        function setCryptoCurrencyRates(firstCurrency) {

            cryptoCoins.forEach(function (criptoCoin) {

                try {
                    criptService.getCriptoCoin(base, criptoCoin);
                } catch (e) {
                    1
                    console.error(e)
                }
            });
        }
    }

}

module.exports = CurrenciesService;
