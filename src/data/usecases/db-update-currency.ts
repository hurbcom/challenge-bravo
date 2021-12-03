import { CurrencyModel } from '../../domain/models/currency'
import { UpdateCurrency } from '../../domain/usecases/update-currency'
import { UpdateCurrencyRepository } from '../protocols/db/currency/update-currency-repository'

export class DbUpdateCurrency implements UpdateCurrency {
  constructor (
        private readonly updateCurrencyRepository: UpdateCurrencyRepository
  ) {}

  async update (shortName: string, updateData: CurrencyModel): Promise<boolean> {
    return await this.updateCurrencyRepository.updateByShortName(shortName, updateData)
  }
}
