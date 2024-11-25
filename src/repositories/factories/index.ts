import { CryptoCurrencyRepository, FiatCurrencyRepository } from '../../repositories';
import { CurrencyRepository } from '../../types';

export class CurrencyRepositoryFactory {
  private static repositories: Map<string, CurrencyRepository> = new Map();

  static getRepository(type: 'fiat' | 'crypto'): CurrencyRepository {
    if (!this.repositories.has(type)) {
      const repository = type === 'fiat' ? new FiatCurrencyRepository() : new CryptoCurrencyRepository();

      this.repositories.set(type, repository);
    }

    return this.repositories.get(type)!;
  }
}
