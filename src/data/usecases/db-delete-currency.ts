import { RemoveCurrency } from '../../domain/usecases/delete-currency'
import { DeleteCurrencyRepository } from '../protocols/db/currency/delete-currency-repository'

export class DbDeleteCurrency implements RemoveCurrency {
  constructor (
        private readonly deleteCurrencyRepository: DeleteCurrencyRepository
  ) {}

  async delete (shortName: string): Promise<boolean> {
    return await this.deleteCurrencyRepository.deleteByShortName(shortName)
  }
}
