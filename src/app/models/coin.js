const axios = require('axios');
const config = require('../../config');

module.exports = {
    convert: async (from, to, amount) => {
        try {
            const res = await axios.get(
                `${config.conversionApiUrl}/data/price?fsym=${from}&tsyms=${to}`,
                {
                    headers: {
                        Authorization: `Apikey ${config.conversionApiKey}`
                    }
                }
            );

            const rate = res.data[to];
            return (rate * amount).toFixed(2);
        } catch (err) {
            return false;
        }
    }
};
