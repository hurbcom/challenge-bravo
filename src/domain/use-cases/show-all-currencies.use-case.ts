import { CurrencyEntityProps } from '../entities/currency.entity';
import CurrencyRepository from '../repositories/currency.repository';

export default class ShowAllCurrenciesUseCase {
  constructor(private readonly currencyRepository: CurrencyRepository) { }

  async execute(): Promise<CurrencyEntityProps[] | null> {
    try {
      const currencyResponse = await this.currencyRepository.findAll();

      return currencyResponse ?? null

    } catch (e) {
      return null
    }
  }
}
