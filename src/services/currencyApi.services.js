const axios = require('axios');

axios.defaults.baseURL = process.env.API_URL;

function formatRates(rates) {
    return Object.entries(rates).reduce((acc, [key, value]) => ({
        ...acc,
        [key.toUpperCase()]: value,
    }), {});
}

exports.getExchangeRates = async () => {
    const result = await axios.get('/latest/currencies/usd.min.json');
    const rates = formatRates(result.data.usd);
    return rates;
};
