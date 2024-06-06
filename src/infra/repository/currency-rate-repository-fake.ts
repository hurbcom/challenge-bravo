import CurrencyRateRepository from "@/application/repository/currency-rate-repository";
import CurrencyRate from "@/domain/currency-rate";
import CurrencyRateNotFoundError from "@/domain/errors/currency-rate-not-found.error";

export default class CurrencyRateRepositoryFake implements CurrencyRateRepository {
  currencyRates: CurrencyRate[];

  constructor() {
    this.currencyRates = [
      {
        id: '1',
        name: 'US Dollar',
        symbol: '$',
        decimalPoints: 2,
        code: 'USD',
        rate: 1.00
      },
      {
        id: '2',
        name: 'Brazilian Real',
        symbol: 'R$',
        decimalPoints: 2,
        code: 'BRL',
        rate: 5.20
      },
      {
        id: '3',
        name: 'Euro',
        symbol: '€',
        decimalPoints: 2,
        code: 'EUR',
        rate: 0.92
      }
    ];
  }

  async findById(id: string) {
    const currencyRate = this.currencyRates.find(currencyRate => currencyRate.id === id);
    if (!currencyRate) {
      throw new CurrencyRateNotFoundError(id);
    }
    return currencyRate;
  }

  async findByCode(code: string) {
    const currencyRate = this.currencyRates.find(currencyRate => currencyRate.code === code);
    if (!currencyRate) {
      throw new CurrencyRateNotFoundError(code);
    }
    return currencyRate;
  }

  async add(currencyRate: CurrencyRate) {
    const exists = await this.exists(currencyRate.code);
    if (exists) {
      throw new Error('Currency rate with code ' + currencyRate.code + ' already exists');
    }
    this.currencyRates.push(currencyRate);
  }

  async save(currencyRate: CurrencyRate) {
    const index = this.currencyRates.findIndex(currencyRate => currencyRate.id === currencyRate.id);
    if (index !== -1) {
      this.currencyRates[index] = currencyRate;
    }
  }

  async delete(id: string) {
    const index = this.currencyRates.findIndex(currencyRate => currencyRate.id === id);
    if (index !== -1) {
      this.currencyRates.splice(index, 1);
    }
  }

  async exists(code: string) {
    return this.currencyRates.some(currencyRate => currencyRate.code === code);
  }
}