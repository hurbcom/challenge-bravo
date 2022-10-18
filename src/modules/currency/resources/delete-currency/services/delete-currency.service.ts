import 'reflect-metadata';
import { container } from 'tsyringe';
import { CurrencyRepository } from '../../../repository/currency.repository';

export class DeleteCurrencyService {
  public async execute(code: string): Promise<Boolean> {
    try {
      const currencyRepository = container.resolve(CurrencyRepository)
      const deleteCurrency = await currencyRepository.deleteByCode(code)
      if(!deleteCurrency) throw new Error ('Was not possible to delete this currency')
      return true
    } catch (error) {
      throw error
    }
  }
}
