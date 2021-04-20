require('../src/db'); // Conexão com o banco.
const Currency = require('../src/models/Currency');
const sync = require('../sync/updateCurrenciesValue');

// Limpando o banco e criando um modelo padrão.
Currency.remove({}, () => {
    const currencies = [
        {currency: 'USD', usd_value: 1},
        {currency: 'BRL', usd_value: 5.54},
        {currency: 'EUR', usd_value: 0.83},
        {currency: 'BTC', usd_value: 0.000016},
        {currency: 'ETH', usd_value: 0.00041},
    ];

    Currency.insertMany(currencies).then(() => {
        // Sincronizando taxas de câmbio
        sync.syncCurrencies(() => {
            process.exit();
        });
    });
});