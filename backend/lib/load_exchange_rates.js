const { dbConnect, dbClose } = require('../db/database_handler');
const cacheClient = require('./cache_client');

dbConnect();

const { currencyExchangeImport } = require('../src/services/CurrencyExchangeImportService');

(async() => {
    await currencyExchangeImport();

    console.info("Taxas de cambio carregadas");
    process.nextTick(() => {
        cacheClient.close(false);
        dbClose();
    });
})();

