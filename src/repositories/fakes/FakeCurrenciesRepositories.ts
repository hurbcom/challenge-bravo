import { uuid } from 'uuidv4';
import { response } from 'express';
import Currencies from '../../models/Currencies';

class FakeCurrenciesRepositories {
    private currencies: Currencies[] = [];

    public async findCurrencyByCode(code: string): Promise<Currencies | undefined> {
      const findCurency = this.currencies.find((currency) => currency.code === code);
      return findCurency;
    }

    public async create({ id, code, name }: Currencies): Promise<Currencies> {
      const currency = new Currencies();

      Object.assign(currency, { id, code, name });

      this.currencies.push(currency);

      return currency;
    }

    public async findCodeById(id: string): Promise<Currencies | undefined> {
      const findCurency = this.currencies.find((currency) => currency.id === id);
      if (!findCurency) {
        throw new Error('Invalid arguments');
      }
      return findCurency;
    }

    public async removeById(id: string): Promise<Currencies[]> {
      const currencyIndex = this.currencies.findIndex((currency) => currency.id === id);
      this.currencies.splice(currencyIndex);
      return this.currencies;
    }
}
export default FakeCurrenciesRepositories;
