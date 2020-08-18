import { uuid } from 'uuidv4';
import Currencies from '../../models/Currencies';
import FakeCurrenciesRepositories from '../../repositories/fakes/FakeCurrenciesRepositories';

interface Request {
    code: string,
    name: string,
}

class FakeAddCurrenciesService {
  public async execute({ code, name }: Request): Promise<Currencies> {
    const currenciesRepositories = new FakeCurrenciesRepositories();
    const findEqualCodes = await currenciesRepositories.findCurrencyByCode(code);
    if (findEqualCodes) {
      throw Error('This currency code has already been added! Please add other currency code');
    }
    const currency = currenciesRepositories.create({
      id: uuid(),
      code,
      name,
    });
    return currency;
  }
}

export default FakeAddCurrenciesService;
