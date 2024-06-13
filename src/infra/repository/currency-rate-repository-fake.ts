import { CurrencyRateRepository } from '@/application/repository/';
import { CurrencyRate } from '@/domain/entity/';
import { CurrencyRateNotFoundError } from '@/domain/errors/';

export class CurrencyRateRepositoryFake implements CurrencyRateRepository {
  currencyRates: CurrencyRate[];

  constructor() {
    this.currencyRates = [
      new CurrencyRate('1', 'US Dollar', 'USD', '$', 2, 1),
      new CurrencyRate('2', 'Brazilian Real', 'BRL', 'R$', 2, 5.2),
      new CurrencyRate('3', 'Euro', 'EUR', '€', 2, 0.92),
    ];
  }

  async findByCode(code: string) {
    const currencyRate = this.currencyRates.find(
      (currencyRate) => currencyRate.code === code
    );
    if (!currencyRate) {
      throw new CurrencyRateNotFoundError(code);
    }
    return currencyRate;
  }

  async add(currencyRate: CurrencyRate) {
    const exists = await this.exists(currencyRate.code);
    if (exists) {
      throw new Error(
        'Currency rate with code ' + currencyRate.code + ' already exists'
      );
    }
    this.currencyRates.push(currencyRate);
  }

  async delete(code: string) {
    const index = this.currencyRates.findIndex(
      (currencyRate) => currencyRate.code === code
    );
    if (index !== -1) {
      this.currencyRates.splice(index, 1);
    }
  }

  async exists(code: string) {
    return this.currencyRates.some(
      (currencyRate) => currencyRate.code === code
    );
  }
}

export default CurrencyRateRepositoryFake;
