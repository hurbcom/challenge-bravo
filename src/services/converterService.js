const axios = require('axios');
require('dotenv').config();

exports.convert = async function (from, to, amount, reference, req, res) {

    // Parâmetros de busca na API de conversão guardados em uma String
    const paramsURL = new URLSearchParams({
        fsym: `${reference}`,
        tsyms: `${from},${to}`,
    }).toString();

    // Armazena a URL completa com parâmetros para a busca
    const url = `${process.env.CONV_API_URL}?${paramsURL}`;

    const response = await axios.get(url);

    const rate = response.data

    // Converte os valores de conversão resgatados para float
    var from = parseFloat(rate[`${from}`], 20);
    var to = parseFloat(rate[`${to}`], 20);

    // Calcula a taxa de câmbio
    const exchangeRate = to / from;

    if (rate) {
        // Calcula o valor final convertido e retorna ele em formato Float
        const convertedValue = exchangeRate * amount;
        return parseFloat(convertedValue.toFixed(3));
    } else {
        throw {
            msg: `O valor de conversão não foi encontrado para ${from}_${to}`
        }
    }
}