require('../src/db'); // Conexão com o banco.
const Currency = require('../src/models/Currency');

Currency.deleteMany({}, function() {
    const currencies = [
        {currency: 'USD', usd_value: 1},
        {currency: 'BRL', usd_value: 5.59},
        {currency: 'EUR', usd_value: 0.83},
        {currency: 'BTC', usd_value: 0.000016},
        {currency: 'ETH', usd_value: 0.00041},
    ];

    Currency.insertMany(currencies);
});

process.exit();