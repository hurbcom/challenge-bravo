import { CurrencyModel } from '../../domain/models/currency'
import { AddCurrency } from '../../domain/usecases/add-currency'
import { AddCurrencyRepository } from '../protocols/db/currency/add-currency-repository'

export class DbAddCurrency implements AddCurrency {
  constructor (
        private readonly addCurrencyRepository: AddCurrencyRepository
  ) {}

  async add (currency: CurrencyModel): Promise<boolean> {
    return await this.addCurrencyRepository.add({ ...currency })
  }
}
