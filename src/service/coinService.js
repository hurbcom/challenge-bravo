const Coin = require('../model/CoinModel');

class CoinService {
    async all() {
        const coins = await Coin.find();
        return coins;
    }

    async allSymbols(except = null) {
        const coins = await this.all();
        let symbols = coins.map((currency) => currency.to);
        if(except) symbols = symbols.filter((to) => to !== except);

        return symbols;
    }

    symbolsToString(except, symbols) {
        if(except) symbols = symbols.filter((to) => to !== except);
        return symbols.join(',');
    }

    async findBySymbol(to) {
        const currency = await Coin.findOne({
            to: to
        });

        return currency;
    }

    async create(body) {
        const currency = new Coin(body);
        await currency.save();

        return currency;
    }

    async createMany(data) {
        const coins = await Coin.insertMany(data);
        return coins;
    } 

    async update(to, body) {
        const currency = await Coin.findOneAndUpdate({
            to: to
        }, body, {
            new: true,
            upsert: true,
        });
        return currency;
    }

    async delete(to) {
        await Coin.findOneAndDelete({
            to: to
        });
    }
}

module.exports = new CoinService();