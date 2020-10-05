import { EntityRepository, Repository } from 'typeorm';
import { Currencies } from './currencies.entity';

@EntityRepository(Currencies)
export class CurrenciesRepository extends Repository<Currencies> {
  async getCurrency(currency: string): Promise<any> {
    //
  }

  async createCurrency(currency: Currencies): Promise<any> {
    //
  }
}
