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
        let cryptoCurrencies = ['BTC', 'ETH'];
        let listOfcurrencies = ['USD', 'BRL', 'EUR'];

        this.loadRates = loadRates;
        this.scheduleReloadValues = scheduleReloadValues;

        return this;

        function scheduleReloadValues() {
            console.log("Loading a data of currencies  in memory");
            cacheProvider.set("Rates", 'base', base, 86400000);
            let listOfCurrencies = cacheProvider.get("currencies", 'valid');
            setRates(base, listOfCurrencies);
            console.log("End loading data");
        }

        async function loadRates() {
            cacheProvider.set("currencies", 'valid', ['BTC', 'ETH','USD', 'BRL', 'EUR']);
            cacheProvider.set("Rates", 'base', base, 86400000);
            console.log("Loading a data of currencies  in memory");
            try {
                setRates(base, cryptoCurrencies.concat(listOfcurrencies).join(','));
            } catch (e) {
                console.error(e)
            }
            console.log("End loading data");
            cacheProvider.set("currencies", 'valid', ['USD', 'BRL', 'EUR','BTC', 'ETH']);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve("");
                }, 10);
            });
        }


        function setRates(keyName = base, to) {
            try {
                criptService.addRate(keyName, to);
            } catch (e) {
                console.error(e)
            }
        }
    }

}

module.exports = LoadData;
