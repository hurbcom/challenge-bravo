const axios = require('axios');

const instance = axios.create({
    baseURL: process.env.API_URL,
    params: { api_key: process.env.API_KEY },
});

exports.getExchangeRate = async (code) => {
    const result = await instance.get('/live', {
        params: { base: 'USD' },
    });
    const rates = result.data.exchange_rates;

    return rates[code];
};
