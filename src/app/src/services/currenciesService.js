const CurrencyRepository = require('../repositories/currencies');

class CurrenciesService {
    async readCurrencies() {
        return CurrencyRepository.getCurrencies();
    }

    async addCurrency(currency) {
        return CurrencyRepository.saveCurrency(currency);
    }

    async deleteCurrency(currency) {
        return CurrencyRepository.deleteCurrency(currency);
    }

    async getConversion(from, to, amount) {
        const fromRate = await CurrencyRepository.getCurrencyRate(from);
        const toRate = await CurrencyRepository.getCurrencyRate(to);
        const fromAmountToUSD = (amount / fromRate);
        const toAmount = fromAmountToUSD * toRate;
        return toAmount.toFixed(4);
    }
}

module.exports = new CurrenciesService();
