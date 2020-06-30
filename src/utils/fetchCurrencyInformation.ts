import axios, { AxiosResponse } from 'axios';
import CurrencyRepository from '../modules/currency/infra/redis/CurrencyRepository';
import defaultCurrencies from '../config/defaultCoins'

const api = axios.create();

/**
 * Uses AwesomeAPI to fetch up to date currency information
 */
class FetchCurrencyInformation {
    private defaultCurrenciesString: string = defaultCurrencies.currencies.join(',')

    public async getDefaultCurrencies(): Promise<any>{
            const currencyData = await api.get(`https://economia.awesomeapi.com.br/all/${this.defaultCurrenciesString}`)
            .then((response: AxiosResponse) => {
                const currenciesData = response.data
                return currenciesData;
            });

        return currencyData;
        }
    }

export default FetchCurrencyInformation;