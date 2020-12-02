const axios = require('axios');
require('dotenv').config();

exports.convert = async function (from, to, amount, reference, req, res) {

    //const query = `${encodeURIComponent(from)}_${encodeURIComponent(to)}`;
/*
    const paramsURL = new URLSearchParams({
        q: query,
        compact: 'ultra',
        apiKey: process.env.CURRCONV_API_KEY
    }).toString();*/

    const paramsURL = new URLSearchParams({
        fsym: `${reference}`,
        tsyms: `${from},${to}`,
    }).toString();

    //const url = `${process.env.CURRCONV_API_URL}?${paramsURL}`;
    //const url = `${process.env.CONV_API_URL}?fsym=${reference}&tsyms=${from},${to}`;
    const url = `${process.env.CONV_API_URL}?${paramsURL}`;

    //const { data } = await axios.get(url);
    const data = await axios.get(url);

    //const exchangeRate = data[query];
    const exchangeRate = data.data
    
    var from = parseFloat(exchangeRate[`${from}`], 20);
    var to = parseFloat(exchangeRate[`${to}`], 20);

    const rate = to/from;

    if (exchangeRate) {
        const convertedValue = rate * amount;
        return parseFloat(convertedValue.toFixed(2));
        //console.log(from)
        //console.log(to)
        //console.log(rate)
        //return parseFloat(rate.toFixed(20));
    } else {
        throw { 
            msg: 'O valor de conversão não foi encontrado para ' + cacheKey 
        }
    }
}