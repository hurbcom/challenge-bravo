import axios from 'axios';

import log from './logger.service';

const cryptoCompareQuotation = async (acceptCoins = null) => {
    const apiKey = process.env.CRYPTO_C_API_KEY;
    const uri = 'https://min-api.cryptocompare.com/data/price';
    const fsym = acceptCoins || 'ETH';
    const tsyms = 'USD';
    const currencyLayerUri = `${uri}?fsym=${fsym}&tsyms=${tsyms}&api_key=${apiKey}`;

    try {
        const response = await axios.get(currencyLayerUri);
        return response.data;
    } catch (error) {
        log(3, 'currency-conversion.controller.js', JSON.stringify(error));
        return error;
    }
};

export { cryptoCompareQuotation as default };
