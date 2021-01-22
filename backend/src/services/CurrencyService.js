const Currency = require('../models/Currency');

class CurrencyService {
    async all() {
        const currencies = await Currency.find();
        return currencies;
    }

    async allSymbols(except = null) {
        const currencies = await this.all();
        let symbols = currencies.map((currency) => currency.symbol);
        if(except) symbols = symbols.filter((symbol) => symbol !== except);

        return symbols;
    }

    symbolsToString(except, symbols) {
        if(except) symbols = symbols.filter((symbol) => symbol !== except);
        return symbols.join(',');
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

    async createMany(data) {
        const currencies = await Currency.insertMany(data);
        return currencies;
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