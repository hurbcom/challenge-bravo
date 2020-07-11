const db = require('../infrastructure/db');
const cache = require('../infrastructure/redis');
const ExchangeRate = require('../integrations/exchange-rate');

class CurrenciesRepository {
    async getCurrencies() {
        const operation = conn => conn.collection('currencies').find().sort({ _id: 1 }).toArray();
        return db.executeOperation(operation);
    }

    async getCurrencyRate(currency) {
        /* Check currency on cache and return on hit */
        const cached = await cache.get(currency);
        if (cached) return cached;

        /* Check currency is available for conversion */
        const isAvailable = await this._isCurrencyAvailable(currency);
        if (!isAvailable) throw new Error("currency_not_available");

        const latestRates = await ExchangeRate.latestUSD();
        cache.set(currency, latestRates.rates[currency], 60 * 60 * 6);
        return latestRates.rates[currency];
    }

    async saveCurrency(currency) {
        const operation = conn => conn.collection('currencies').insertOne(currency);
        return db.executeOperation(operation);
    }

    async deleteCurrency(currency) {
        const operation = conn => conn.collection('currencies').deleteOne(currency);
        return db.executeOperation(operation);
    }

    async _isCurrencyAvailable(currency) {
        const operation = conn => conn.collection('currencies').find().sort({ _id: 1 }).toArray();
        const availableCurrenciesObjectList = await db.executeOperation(operation);
        const availableCurrenciesList = availableCurrenciesObjectList.map(item => item.currency);
        return availableCurrenciesList.indexOf(currency) >= 0;
    }
}

module.exports = new CurrenciesRepository();
