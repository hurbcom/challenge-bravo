const CurrencyExchange = require('../models/CurrencyExchange');
const cacheClient = require('../../lib/cache_client');

class CurrencyExchangeService {
    async all() {
        const currencyExchanges = await CurrencyExchange.find();
        return currencyExchanges;
    }

    async findByBaseSymbol(baseSymbol) {
        const exchangeRates = await CurrencyExchange.findOne({
            baseSymbol: baseSymbol
        }).sort({ createdAt: -1 });

        return exchangeRates;
    }

    async create(body) {
        const currencyExchange = new CurrencyExchange(body);
        await currencyExchange.save();
        return currencyExchange;
    }

    async createMany(data) {
        const currencyExchanges = await CurrencyExchange.insertMany(data);
        return currencyExchanges;
    }

    async update(baseSymbol, body) {
        const currencyExchange = await CurrencyExchange.findOneAndUpdate({
            baseSymbol: baseSymbol
        }, body, {
            new: true,
            upsert: true,
        });
        return currencyExchange;
    }

    async delete(baseSymbol) {
        await CurrencyExchange.findOneAndDelete({
            baseSymbol: baseSymbol
        });
    }

    async converter(from, to, amount) {
        let currencyConverted = "0.00";

        try {
            const cacheKey = `${from}-${to}`;

            let currencyRate = await cacheClient.getAsync(cacheKey);

            if(!currencyRate) {
                const currencyRates = await this.findByBaseSymbol(from);
                const { rates } = currencyRates || {};

                if(rates) {
                    const { rate } = rates.find((currencyRate) => currencyRate.symbol === to) || 0;
                    currencyRate = rate;
                    await cacheClient.setAsync(cacheKey, rate);
                }
            }

            if(currencyRate > 0) currencyConverted = `${(amount * currencyRate)}`;
        } catch (err) {
            console.error("Ocorreu um erro ao converter os valores", err);
        }

        return { amount: currencyConverted };
    }
}

module.exports = new CurrencyExchangeService();