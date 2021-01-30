const schedule = require('node-schedule');

const DEFAULT_CURRENCY_LIST = ['usd', 'brl', 'eur', 'eth', 'btc'];

class UpdateConversionRates {
    constructor({ conversionService, currencyService }) {
        this.currencyService = currencyService;
        this.conversionService = conversionService;
    }

    async initJob() {
        for await (const currency of DEFAULT_CURRENCY_LIST) {
            await this.currencyService.addCurrency(currency);
        }

        this.job = schedule.scheduleJob('0 * * ? * *', () => {
            this.conversionService.updateConversionRates();
        });
        console.log('Updating conversion rates');
    }

    cancelJob() {
        if (this.job) {
            this.job.cancel();
            return;
        }
        console.warn('No job is running!');
    }
}

module.exports = UpdateConversionRates;
