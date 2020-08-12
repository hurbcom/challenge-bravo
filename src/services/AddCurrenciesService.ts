import { getCustomRepository } from 'typeorm';

import Currencies from '../models/Currencies';
import CurrenciesRepositories from '../repositories/CurrenciesRepositories';

interface Request {
    code: string,
    name: string,
}

class AddCurrenciesService {
  public async execute({ code, name }: Request): Promise<Currencies> {
    const currenciesRepositories = getCustomRepository(CurrenciesRepositories);
    const findEqualCodes = await currenciesRepositories.findCurrencyByCode(code);
    if (findEqualCodes) {
      throw Error('This currency code has already been added! Please add other currency code');
    }
    const currency = currenciesRepositories.create({
      code,
      name,
    });
    await currenciesRepositories.save(currency);
    return currency;
  }
}

export default AddCurrenciesService;
