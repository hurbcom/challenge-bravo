const schedule = require('node-schedule');
const { Container } = require('typedi');
const ExchangeRatesService = require('../services/exchange-rates-service');
const Configuration = require('../config/config');
const CurrencyService = require('../services/currency-service');
const { DEFAULT_CURRENCY_KEYS } = require('../config/config');

class UpdateExchangeRatesJob {
    async initJob() {
        const currencyService = Container.get(CurrencyService);

        for await (const currency of DEFAULT_CURRENCY_KEYS) {
            await currencyService.addCurrencyIfNew(currency);
        }

        this.job = schedule.scheduleJob(Configuration.CRON_JOB_STRING, () => {
            Container.get(ExchangeRatesService).updateHistoricalExchangeRates();
        });
        console.log('UpdateExchangeRatesJob initialized.');
    }

    cancelJob() {
        if (this.job) {
            this.job.cancel();
            return;
        }
        console.warn('UpdateExchangeRatesJob cancel failed! Job is not running!');
    }
}

module.exports = UpdateExchangeRatesJob;
