import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const currencyLayerConvert = async () => {
    const apiKey = '77a212831646cff6cc9bc9b167af4d05';
    const uri = 'http://apilayer.net/api/live';
    const currencies = 'USD,BRL,EUR,BTC';
    const source = 'USD';
    const currencyLayerUri = `${uri}?access_key=${apiKey}&currencies=${currencies}&source=${source}&format=1`;

    try {
        const response = await axios.get(currencyLayerUri);

        if (response.data.error) {
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
