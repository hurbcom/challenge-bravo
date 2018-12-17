import axios from 'axios';

const cryptoCompareQuotation = async (acceptCoins = null) => {
    const apiKey = 'f9b55379ec5b8f95bd1376aae858083d548d06b7c0b3ee15fcf1699477c2e5b3';
    const uri = 'https://min-api.cryptocompare.com/data/price';
    const fsym = acceptCoins || 'ETH';
    const tsyms = 'USD';
    const currencyLayerUri = `${uri}?fsym=${fsym}&tsyms=${tsyms}&api_key=${apiKey}`;

    try {
        const response = await axios.get(currencyLayerUri);
        return response.data;
    } catch (error) {
        return error;
    }
};

export { cryptoCompareQuotation as default };
