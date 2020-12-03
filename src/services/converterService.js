const axios = require('axios');
require('dotenv').config();

exports.convert = async function (from, to, amount, reference, req, res) {

    const paramsURL = new URLSearchParams({
        fsym: `${reference}`,
        tsyms: `${from},${to}`,
    }).toString();

    const url = `${process.env.CONV_API_URL}?${paramsURL}`;

    const response = await axios.get(url);

    const rate = response.data
    
    var from = parseFloat(rate[`${from}`], 20);
    var to = parseFloat(rate[`${to}`], 20);

    const exchangeRate = to/from;

    if (rate) {
        const convertedValue = exchangeRate * amount;
        return parseFloat(convertedValue.toFixed(3));
    } else {
        throw { 
            msg: `O valor de conversão não foi encontrado para ${from}_${to}` 
        }
    }
}