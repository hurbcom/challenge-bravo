const axios = require("axios");

const Exchange = {};

Exchange.get = (from, to, amount) => {
    const baseUrl = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;

    return axios.get(baseUrl).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error;
        }
    );
};

Exchange.getCrypto = (from, to, amount) => {
    const baseUrl = `https://api.coingate.com/v2/rates/merchant/${from}/${to}`;

    return axios.get(baseUrl).then(
        (response) => {
            return response.data;
        },
        (error) => {
            return error;
        }
    );
};

module.exports = Exchange;
