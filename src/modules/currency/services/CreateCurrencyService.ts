import Currency from '../infra/models/Currency';
import CurrencyRepository from '../infra/redis/CurrencyRepository';
import FetchCurrencyInformation from '../../../utils/FetchCurrencyInformation';

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
     * Creates a currency in the database. If given only a name it will look for the information on externalAPI. The currency value
     * can also be manually input if a value is given
     */
    public async execute(name: string, value?: number): Promise<Currency | void> {
        if(value){
            try {
                await this.currencyRepository.save(name, value);
                return new Currency(name, value);
            } catch(err){
                throw new Error(err.message);
            }
        }
        const currencyFetcher =  new FetchCurrencyInformation()
        const newCurrency = await currencyFetcher.getDefaultCurrencies(name);
        this.currencyRepository.save(name, newCurrency[name]);
        return new Currency(name, newCurrency[name]);
    }
}

export default CreateCurrencyService;