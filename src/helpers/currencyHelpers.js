const axios = require('axios');

const convertAmount = async (from, to, amount) => {

    const convertionLabel = from + "_" + to;
    const url = "https://free.currconv.com/api/v7/convert?apiKey=82bc8e1eb484a8e17ac0&q="+convertionLabel+"&compact=y";
    
    try {
        const response = await axios.get(url);

        const conversion = response.data;

        if(!conversion[convertionLabel]) { // CONVERSÃO INVALIDA
            return null;
        }

        if(!conversion[convertionLabel].val) { // CONVERSÃO
            return null;
        }

        const convertedValue = amount * conversion[convertionLabel].val;

        return convertedValue;
    } catch (e) {
        return null;
    }
};

module.exports = {
    convertAmount
};