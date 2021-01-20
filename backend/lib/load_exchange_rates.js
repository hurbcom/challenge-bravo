const { dbConnect, dbClose } = require('../db/database_handler');

dbConnect();

const { currencyExchangeImport } = require('../src/services/CurrencyExchangeImportService');

currencyExchangeImport()
        .then((data) => {
            console.info("Taxas de cambio carregadas");
            dbClose();
        })
        .catch((err) => console.error(err));


