import axios from 'axios';

import log from './logger.service';

const currencyLayerQuotation = async (acceptCoins = null) => {
    const apiKey = process.env.CURRENCY_L_API_KEY;
    const uri = 'http://apilayer.net/api/live';
    const currencies = acceptCoins || 'USD,BRL,EUR,BTC';
    const source = 'USD';
    const currencyLayerUri = `${uri}?access_key=${apiKey}&currencies=${currencies}&source=${source}&format=1`;

    try {
        const response = await axios.get(currencyLayerUri);

        if (response.data.error) {
            log(3, 'currency-conversion.controller.js', JSON.stringify(response.data));
            return response.data;
        }

        const { quotes } = response.data;
        const defaultQuotes = {
            BRL: quotes.USDBRL,
            EUR: quotes.USDEUR,
            BTC: quotes.USDBTC,
            USD: quotes.USDUSD,
        };
        return defaultQuotes;
    } catch (error) {
        return error;
    }
};

export { currencyLayerQuotation as default };
