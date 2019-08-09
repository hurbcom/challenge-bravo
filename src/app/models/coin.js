const axios = require('axios');
const config = require('../../config');
const redisClient = require('../../utils/redis');

module.exports = {
    convert: async (from, to, amount) => {
        try {
            // Antes de realizar a chamada à API verifica se há a informação no cache
            const cachedRate = await redisClient.getAsync(`CONVERSION:${from}:${to}`);
            if (cachedRate) return (cachedRate * amount).toFixed(2);

            const res = await axios.get(
                `${config.conversionApiUrl}/data/price?fsym=${from}&tsyms=${to}`,
                {
                    headers: {
                        Authorization: `Apikey ${config.conversionApiKey}`
                    }
                }
            );

            const rate = res.data[to];

            if (!rate) {
                throw new Error('Could not get the conversion rate');
            }

            // Salva a informação no cache
            await redisClient.setAsync(`CONVERSION:${from}:${to}`, rate);
            return (rate * amount).toFixed(2);
        } catch (err) {
            return false;
        }
    }
};
