import { CurrencyResponse } from '../entities/dto/currency-response.dto';
import CurrencyRepository from '../repositories/currency.repository';

export default class ShowApiAllCurrenciesUseCase {
  constructor(private readonly currencyRepository: CurrencyRepository) { }
  async execute(code: string): Promise<CurrencyResponse[] | null> {
    try {
      const currencyResponse = await this.currencyRepository.findAllApi();

      return currencyResponse ?? null

    } catch (e) {
      return null
    }
  }
}