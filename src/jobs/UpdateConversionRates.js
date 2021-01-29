const schedule = require('node-schedule');
const ConversionService = require('../services/ConversionService');
const CurrencyService = require('../services/CurrencyService');

const DEFAULT_CURRENCY_KEYS = ['usd', 'brl', 'eur', 'eth', 'btc']

class UpdateConversionRates {
    async initJob() {
        const currencyService = CurrencyService;

        for await (const currency of DEFAULT_CURRENCY_KEYS) {
            await currencyService.addCurrency(currency);
        }

        this.job = schedule.scheduleJob('0 * * ? * *', () => {
            ConversionService.updateConversionRates();
        });
        console.log('UpdateConversionRates initialized.');
    }

    cancelJob() {
        if (this.job) {
            this.job.cancel();
            return;
        }
        console.warn('UpdateConversionRates cancel failed! Job is not running!');
    }
}

module.exports = new UpdateConversionRates();
