const app = require("./app");
const { currencyExchangeImport } = require('./src/services/CurrencyExchangeImportService');
const { CronJob } = require('cron');

const job = new CronJob('*/30 * * * *', () => {
    currencyExchangeImport()
        .then((data) => console.info("Dados importados"))
        .catch((err) => console.error(err));
}, null, true, 'America/Sao_Paulo');

job.start();

app.listen(5000);