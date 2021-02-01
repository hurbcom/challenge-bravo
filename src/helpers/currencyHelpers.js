const axios = require('axios');
const currencyCache = require('../providers/CurrencyCache');

const convertAmount = async (from, to, amount) => {
    const convertionLabel = from + "_" + to;
    try {
        let convertedVal = 0;
        const value = await currencyCache.get(convertionLabel);
        if(parseFloat(value)) {
            convertedVal = parseFloat(value);
        } else {
            const url = "https://free.currconv.com/api/v7/convert?apiKey=82bc8e1eb484a8e17ac0&q="+convertionLabel+"&compact=y";
            const response = await axios.get(url);

            const conversion = response.data;
            if(!conversion[convertionLabel]) { // CONVERSÃO INVALIDA
                return null;
            }

            if(!conversion[convertionLabel].val) { // CONVERSÃO
                return null;
            }

            convertedVal = conversion[convertionLabel].val;
            currencyCache.set(convertionLabel, conversion[convertionLabel].val, 1440 * 60);
        }

        if (!convertedVal) {
            return null;
        }

        return amount * convertedVal;
    } catch (e) {
        return null;
    }
};

module.exports = {
    convertAmount
};