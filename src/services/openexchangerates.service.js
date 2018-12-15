import axios from 'axios';

// eslint-disable-next-line import/prefer-default-export
export const openExchangeratesConvert = async () => {
    const appId = '46208269135b4a18812f848f2172e459';
    const uri = 'https://openexchangerates.org/api/latest.json';
    const symbols = 'USD,BRL,EUR,BTC,ETH';
    const base = 'USD';

    const openExchangeratesUri = `${uri}?app_id=${appId}&symbols=${symbols}&base=${base}&format=1`;

    try {
        const response = await axios.get(openExchangeratesUri);
        return response.data.rates;
    } catch (error) {
        return error.response.data;
    }
};
