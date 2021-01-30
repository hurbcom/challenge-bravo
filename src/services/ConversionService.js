const ConversionRate = require('../models/ConversionRate');
const Conversion = require('../interfaces/Conversion');
const Error = require('../interfaces/Error');

class ConversionService {
    constructor({ coinGeckoService, conversionRepository, currencyRepository }) {
        this.coinService = coinGeckoService;
        this.conversionRepository = conversionRepository;
        this.currencyRepository = currencyRepository;
    }

    async getLatestConversionRate() {
        const latestRates = await this.conversionRepository.getLatest();
        return latestRates;
    }

    async convertFromTo(from, to, amount) {
        const latestRate = await this.conversionRepository.getLatest();
        const fromRate = latestRate[from];
        const toRate = latestRate[to];
        if (fromRate && toRate) {
            const result = new Conversion(
                from,
                to,
                amount,
                (toRate * amount) / fromRate,
                new Date()
            );
            return result;
        }
        const unavailableKey = !fromRate ? from : to;
        throw new Error(400, `${unavailableKey} currency is not supported`);
    }

    async updateConversionRates() {
        const conversionRate = await this.coinService.getAll();
        const availableCurrencies = await this.currencyRepository.list();
        const referenceValue = conversionRate.usd.value;
        const updatedConversionRate = new ConversionRate();
        availableCurrencies.forEach((currency) => {
            const currencyKey = currency.key;
            updatedConversionRate[currencyKey] = conversionRate[currencyKey].value / referenceValue;
        });
        await this.conversionRepository.insert(updatedConversionRate);
        console.log('Conversion rates successfully updated');
        return updatedConversionRate;
    }
}
module.exports = ConversionService;
