const { dbConnect, dbClose } = require('./database');
const cacheClient = require('./cache');
const { convertImport } = require('../service/api');


dbConnect();

(async() => {
    await convertImport();

    console.info("Carregado .. Pronto para converter..");
    process.nextTick(() => {
        console.info("Ok..");
        cacheClient.close(false);
        dbClose();
    });
})();

