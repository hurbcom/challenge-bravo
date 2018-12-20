import axios from 'axios';

import log from './logger.service';

const openExchangeratesQuotation = async (acceptCoins = null) => {
    const appId = process.env.OPEN_E_API_KEY;
    const uri = 'https://openexchangerates.org/api/latest.json';
    const symbols = acceptCoins || 'USD,BRL,EUR,BTC';
    const base = 'USD';

    const openExchangeratesUri = `${uri}?app_id=${appId}&symbols=${symbols}&base=${base}&format=1`;

    try {
        const response = await axios.get(openExchangeratesUri);
        return response.data.rates;
    } catch (error) {
        log(3, 'currency-conversion.controller.js', JSON.stringify(error.response.data));
        return error.response.data;
    }
};

export { openExchangeratesQuotation as default };
