const app = require("./app");
const { currencyExchangeImport } = require('./src/services/CurrencyExchangeImportService');
const { CronJob } = require('cron');

// currencyExchangeImport();
const job = new CronJob('*/30 * * * *', () => {
    (async() => {
        await currencyExchangeImport();
    })();
}, null, true, 'America/Sao_Paulo');

job.start();

app.listen(5000);