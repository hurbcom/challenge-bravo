const axios = require('axios');
require('dotenv').config();

exports.convert = async function (from, to, amount) {

    const query = `${encodeURIComponent(from)}_${encodeURIComponent(to)}`;

    const paramsURL = new URLSearchParams({
        q: query,
        compact: 'ultra',
        apiKey: process.env.CURRCONV_API_KEY
    }).toString();

    const url = `${process.env.CURRCONV_API_URL}?${paramsURL}`;

    const { data } = await axios.get(url);

    const exchangeRate = data[query];

    if (exchangeRate) {
        const convertedValue = exchangeRate * amount;
        return parseFloat(convertedValue.toFixed(2));
    } else {
        throw { 
            msg: 'O valor de conversão não foi encontrado para ' + query 
        }
    }
}