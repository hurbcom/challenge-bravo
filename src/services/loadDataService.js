require('express');
const cacheProvider = require('./cacheService').instance();
const criptService = require('./currenciesService');
const numberUtil = require('../util/numbers');
require('../services/loadDataService');

let base = "USD";

class LoadData {
    async getConversionCurrencies(from, to, amount) {
        amount = numberUtil.formatCurrency(amount);
        let ratesFrom = numberUtil.formatCurrency(cacheProvider.get('Rates', from));
        let ratesTo = numberUtil.formatCurrency(cacheProvider.get('Rates', to));
        if (ratesFrom == null || ratesTo == null)
            throw new Error("some unexpected/uncaught async exception");

        if (from === base) return numberUtil.formatCurrency(amount * ratesTo);
        if (to === base) return numberUtil.formatCurrency(amount / ratesFrom);

        return numberUtil.formatCurrency(amount / ratesFrom * ratesTo);
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
            cacheProvider.get("coins", 'valid');
            cacheProvider.set("Rates", 'base', base);

            setRates(base, cacheProvider.get("cripto", 'valid').concat(cacheProvider.get("coins", 'valid')).join(','));

            console.log("End loading data");
        }

        async function loadRates() {
            cacheProvider.set("cripto", 'valid', ['BTC', 'ETH',]);
            cacheProvider.set("coins", 'valid', ['USD', 'BRL', 'EUR']);
            cacheProvider.set('Data', "Loading", true);
            console.log("Loading a data of currencies  in memory");
            try {
                setRates(base, cryptoCoins.concat(listOfCoins).join(','));
            } catch (e) {
                console.error(e)
            }
            console.log("End loading data");

            cacheProvider.set("cripto", 'valid', ['BTC', 'ETH',]);
            cacheProvider.set("coins", 'valid', ['USD', 'BRL', 'EUR']);
            cacheProvider.set('Data', "Loading", false);

            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("");
                }, 10);
            });
        }


        function setRates(keyName, to) {
            try {
                criptService.getRates(keyName, to);
            } catch (e) {
                console.error(e)
            }
        }
    }

}

module.exports = LoadData;
