const axios = require('axios');

/**
 * Chama o serviço de terceiros responsável pelo valor das moedas e já faz o calculo da conversão
 * @param {decimal} amount 
 * @param {string} fromCurrency 
 * @param {string} toCurrency 
 */
async function convert(amount, fromCurrency, toCurrency) {

    const query = `${encodeURIComponent(fromCurrency)}_${encodeURIComponent(toCurrency)}`;
    const urlParams = new URLSearchParams({
        q: query,
        compact: 'ultra',
        apiKey: process.env.CURRENCY_CONVERTER_API_KEY
    }).toString();

    const url = `${process.env.CURRENCY_CONVERTER_API_URL}?${urlParams}`;

    const { data } = await axios.get(url);

    const convertedValue = data[query];

    if (convertedValue) {
        const total = convertedValue * amount;
        return parseFloat(total.toFixed(2));
    } else {
        throw new Error(`Valor não encontrado para ${query}`);
    }
}

module.exports = {
    convert
}