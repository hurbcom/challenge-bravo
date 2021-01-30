const Client = require("coinbase").Client;
const { promisify } = require("util");
const { API_KEY, API_SECRET } = process.env;

const client = new Client({
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    strictSSL: false,
});
//Ver como fazer isso aqui ser testado com mock
client.getExchangeRatesAsync = promisify(client.getExchangeRates);

const getCurrency = async (currency) => {
    try {
        return await client.getExchangeRatesAsync({ currency });
    } catch (error) {
        console.error(error);
        throw new Error(`Error to get currency data (${currency}).`);
    }
};

module.exports = { getCurrency };
