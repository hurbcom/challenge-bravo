const Currency = require('../models/Currency');

class CurrencyService {
    async all() {
        const currencies = await Currency.find();
        return currencies;
    }

    async findBySymbol(symbol) {
        const currency = await Currency.findOne({
            symbol: symbol
        });
        return currency;
    }

    async create(body) {
        const currency = new Currency(body);
        await currency.save();
        return currency;
    }

    async update(symbol, body) {
        const currency = await Currency.findOneAndUpdate({
            symbol: symbol
        }, body, {
            new: true,
            upsert: true,
        });
        return currency;
    }

    async delete(symbol) {
        await Currency.findOneAndDelete({
            symbol: symbol
        });
    }
}

module.exports = new CurrencyService();