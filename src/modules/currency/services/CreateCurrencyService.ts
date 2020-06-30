import Currency from '../infra/models/Currency';
import CurrencyRepository from '../infra/redis/CurrencyRepository';
import treatCurrency from '../../../utils/treatCurrency';

import axios, { AxiosResponse } from 'axios';
const api = axios.create();

class CreateCurrencyService {

    private currencyRepository : CurrencyRepository;

    constructor(currencyRepository: CurrencyRepository){
        this.currencyRepository = currencyRepository;
    }
    /**
     *
     * @param name
     * @param value
     *
     * Creates a currency in the database. If given only a name it will look for the information on awesomeapi. The currency value
     * can also be manually input if a value is given
     */
    public async execute(name: string, value?: number): Promise<Currency | void> {
        const baseCurrency = await api.get(`https://economia.awesomeapi.com.br/all/USD`).then((response: AxiosResponse) => {
            console.log(response.data['USD'].ask)
            return response.data['USD'].ask;
        });;
        if(!value){
            const value = await api.get(`https://economia.awesomeapi.com.br/all/${name}`).then((response: AxiosResponse) => {
                return response.data;
            });
            const currency = await this.currencyRepository.save(name, treatCurrency(Number(baseCurrency), value[name].ask));
            return currency;
        } else {
            const currency = await this.currencyRepository.save(name, value);
            return currency;
        }
    }
}

export default CreateCurrencyService;