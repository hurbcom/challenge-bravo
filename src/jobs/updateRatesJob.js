const cron = require("node-cron");
const configService = require("../services/configService");
const currencyExchangeService = require("../services/currencyExchangeService");
const currenciesDao = require("../database/currenciesDao");
const dbContext = require("../database/dbContext");

const { UPDATE_RATE_JOBS_CRON } = process.env;

dbContext.connect();

cron.schedule(UPDATE_RATE_JOBS_CRON, async function () {
    try {
        console.log("INIT - UpdateRatesJob")
        const {
            data: { rates },
        } = await currencyExchangeService.getCurrency(
            configService.BASE_CURRENCY
        );

        const currencies = await currenciesDao.find({});

        for await (const currency of currencies) {
            await currenciesDao.updateOne(
                { code: currency.code },
                { $set: { rateToBase: rates[currency.code] } }
            );
        }
        console.log("END - UpdateRatesJob")
    } catch (error) {
        console.error(error.message);
        throw error;
    }
});
