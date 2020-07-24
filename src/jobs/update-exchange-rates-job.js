const schedule = require('node-schedule');
const { Container } = require('typedi');
const ExchangeRatesService = require('../services/exchange-rates-service');
const Configuration = require('../config/config');

class UpdateExchangeRatesJob {
    initJob() {
        this.job = schedule.scheduleJob(Configuration.CRON_JOB_STRING, () => {
            Container.get(ExchangeRatesService).updateHistoricalExchangeRates();
            console.log('Successfully obtained updated exchange rates.');
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
