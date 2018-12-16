import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const coinmarketcapConvert = async () => {
    const apiKey = '5ce9ebb6-d0b8-4825-82cd-823cf6e30f32';
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
