const cron = require('node-cron');
const currenciesServices = require('../services/currencies.services');

exports.updateCurrenciesRates = async () => {
    try {
        if (JSON.parse(process.env.UPDATE_RATES_STARTUP)) {
            await currenciesServices.updateCurrenciesRates();
        }

        cron.schedule(process.env.CRON_JOB_CURRENCY, async () => {
            await currenciesServices.updateCurrenciesRates();
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update currencies rates');
    }
};
