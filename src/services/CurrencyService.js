const Currency = require('../models/Currency');
const Error = require('../interfaces/Error');

class CurrencyService {
    constructor({ currencyRepository, coinGeckoService, conversionService }) {
        this.repository = currencyRepository;
        this.coinService = coinGeckoService;
        this.conversionService = conversionService;
    }

    async listCurrencies() {
        const currentCurrencies = await this.repository.list();
        return currentCurrencies;
    }

    async getCurrency(key) {
        const currency = await this.repository.findByKey(key);
        if (currency) {
            return currency;
        }
        return null;
    }

    async addCurrency(key) {
        const currency = await this.repository.findByKey(key);
        if (currency) {
            return currency;
        }

        const availableCoins = await this.coinService.getAll();
        const availableCoin = availableCoins[key];

        if (availableCoin) {
            const newCurrency = new Currency(
                key,
                availableCoin.name,
                availableCoin.unit,
                availableCoin.type
            );

            this.repository.insert(newCurrency);
            await this.conversionService.updateConversionRates();
            return newCurrency;
        }
        throw new Error(400, `${key} currency is not supported`);
    }

    async removeCurrency(key) {
        const currency = await this.repository.findByKey(key);
        if (currency) {
            this.repository.delete(key);
            return this.conversionService.updateConversionRates();
        }
        throw new Error(404, `Currency ${key} was not found`);
    }
}

module.exports = CurrencyService;
