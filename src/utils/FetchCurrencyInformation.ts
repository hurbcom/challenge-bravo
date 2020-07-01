import axios, { AxiosResponse } from 'axios';
import defaultCurrencies from '../config/defaultCurrencies';

const api = axios.create();

/**
 * Uses and external API to fetch up to date currency information
 */
class FetchCurrencyInformation {
    public async getDefaultCurrencies(currency: string): Promise<any>{
            const apiResult = await api.get(`https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${currency}`)
            .then((response: AxiosResponse) => {
                return response.data;
            });

        return apiResult;
        }
    }

export default FetchCurrencyInformation;