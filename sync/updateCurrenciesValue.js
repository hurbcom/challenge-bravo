const Currency = require('../src/models/Currency');
const axios = require('axios')

const apiUrl = 'https://api.currencyfreaks.com/latest';
const apiKey = 'e5f808fdf9e14f1fa2bfdd129feedb4d';

// Sincroniza as taxas de câmbio com base no USD
exports.syncCurrencies = (callback) => {
    Currency.find({}, (err, registeredCurrencies) => {
        if (!err) {
            axios.get(`${apiUrl}?apikey=${apiKey}`).then(async (res) => {
                const currencies = res.data.rates;
                for (let i in registeredCurrencies) {
                    const currency = registeredCurrencies[i];
                    const usdValue = parseFloat(currencies[currency.currency]);
                    currency.usd_value = usdValue;
                    await currency.save();
                }

                callback();
            });
        }
    });
};