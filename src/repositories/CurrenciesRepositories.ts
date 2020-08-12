import { EntityRepository, Repository } from 'typeorm';

import Currencies from '../models/Currencies';

@EntityRepository(Currencies)
class CurrenciesRepositories extends Repository<Currencies> {
  public async findCurrencyByCode(code: string): Promise<Currencies | null> {
    const findCurrencyByCode = await this.findOne({
      where: { code },
    });
    return findCurrencyByCode || null;
  }
}
export default CurrenciesRepositories;
