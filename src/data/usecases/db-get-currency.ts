import { CurrencyModel } from '../../domain/models/currency'
import { GetCurrency } from '../../domain/usecases/get-currency'
import { GetCurrencyRepository } from '../protocols/db/currency/get-currency-repository'

export class DbGetCurrency implements GetCurrency {
  constructor (
        private readonly getCurrencyRepository: GetCurrencyRepository
  ) {}

  async getByShortName (shortName: string): Promise<CurrencyModel> {
    return await this.getCurrencyRepository.getByShortName(shortName)
  }
}
