import { getCustomRepository } from 'typeorm';

import Currency from '../models/Currency';
import CurrenciesRepository from '../repositories/CurrenciesRepository';

class ListCurrencyService {
    public async execute(): Promise<Currency[]> {
        const currenciesRepository = getCustomRepository(CurrenciesRepository);

        const currencies = await currenciesRepository.findAllCurrencies();

        return currencies;
    }
}

export default ListCurrencyService;
