import axios from 'axios';

const coinmarketcapQuotation = async () => {
    const apiKey = process.env.COIN_M_T_API_KEY;
    const uri = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
    const symbol = 'ETH';
    const convert = 'USD';
    const currencyLayerUri = `${uri}?symbol=${symbol}&convert=${convert}`;

    axios.defaults.headers.common['X-CMC_PRO_API_KEY'] = apiKey;

    try {
        const response = await axios.get(currencyLayerUri);
        return response.data;
    } catch (error) {
        return error;
    }
};

export { coinmarketcapQuotation as default };
