const moment = require('moment');
const Configuration = require('../config/config');
const CurrencyDao = require('../dao/currency-dao');
const HistoricalExchangeRatesDao = require('../dao/historical-exchange-rates-dao');
const ExchangeRates = require('../models/exchange-rates');
const ExchangeResult = require('../models/exchange-result');
const ICoinService = require('./coin-service-interface');

class ExchangeRatesService {
    constructor(container) {
        this.coinService = container.get(ICoinService);
        this.historicalRatesDao = container.get(HistoricalExchangeRatesDao);
        this.currencyDao = container.get(CurrencyDao);
    }

    async getLatestExchangeRates() {
        const latestRates = await this.historicalRatesDao.getLatest();
        latestRates.referenceDate = moment(latestRates.referenceDate).format(
            Configuration.DEFAULT_DATE_FORMAT
        );
        return latestRates;
    }

    async exchangeFromTo(from, to, amount) {
        const latestRate = await this.historicalRatesDao.getLatest();
        const fromRate = latestRate[from];
        const toRate = latestRate[to];
        if (fromRate && toRate) {
            const result = new ExchangeResult();
            result.from = from;
            result.to = to;
            result.amount = amount;
            result.value = (toRate * amount) / fromRate;
            result.referenceDate = moment().format(Configuration.DEFAULT_DATE_FORMAT);
            return result;
        }
        throw Error(`No support provided to given currency from: ${from} to: ${to}`);
    }

    async updateHistoricalExchangeRates() {
        const exchangeRates = await this.coinService.getAll();
        const availableCurrencies = await this.currencyDao.list();
        const referenceValue = exchangeRates.usd.value;
        const updatedExchangeRates = new ExchangeRates();
        availableCurrencies.forEach((currency) => {
            const currencyKey = currency.key;
            updatedExchangeRates[currencyKey] = exchangeRates[currencyKey].value / referenceValue;
        });
        await this.historicalRatesDao.insert(updatedExchangeRates);
        return updatedExchangeRates;
    }
}
module.exports = ExchangeRatesService;
