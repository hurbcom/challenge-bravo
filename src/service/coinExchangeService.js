const CoinConvert = require('../model/CoinExchangeModel');
const cache = require('../db/cache');

class CoinConvertService {
    async all() {
        const coinconverter = await CoinConvert.find();
        return coinconverter;
    }

    async findByBaseSymbol(baseSymbol) {
        const exchangeRates = await CoinConvert.findOne({
            baseSymbol: baseSymbol
        }).sort({ createdAt: -1 });

        return exchangeRates;
    }

    async create(body) {
        const coinExchangeange = new CoinConvert(body);
        await coinExchangeange.save();
        return coinExchangeange;
    }

    async createMany(data) {
        const coinconverter = await CoinConvert.insertMany(data);
        return coinconverter;
    }

    async update(baseSymbol, body) {
        const currencyExchange = await CoinConvert.findOneAndUpdate({
            baseSymbol: baseSymbol
        }, body, {
            new: true,
            upsert: true,
        });
        return currencyExchange;
    }

    async delete(baseSymbol) {
        await CoinConvert.findOneAndDelete({
            baseSymbol: baseSymbol
        });
    }

    async converter(from, to, amount) {
        let defaultConverted = "0.00";

        try {
            const cacheKey = `${from}-${to}`;

            let currencyRate = await cache.getAsync(cacheKey);

            if(!currencyRate) {
                const currencyRates = await this.findByBaseSymbol(from);
                const { rates } = currencyRates || {};

                if(rates) {
                    const { rate } = rates.find((currencyRate) => currencyRate.to === to) || 0;
                    currencyRate = rate;
                    await cache.setAsync(cacheKey, rate);
                }
            }

            if(currencyRate > 0) defaultConverted = `${(amount * currencyRate)}`;
        } catch (err) {
            console.error("Erro ao converter os valores", err);
        }

        return { amount: defaultConverted };
    }
}

module.exports = new CoinConvertService();