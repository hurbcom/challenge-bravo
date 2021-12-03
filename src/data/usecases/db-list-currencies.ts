import { CurrencyModel } from '../../domain/models/currency'
import { ListCurrencies } from '../../domain/usecases/list-currencies'
import { ListCurrencyRepository } from '../protocols/db/currency/list-currency-repository'

export class DbListCurrencies implements ListCurrencies {
  constructor (
        private readonly listCurrencyRepository: ListCurrencyRepository
  ) {}

  async list (): Promise<CurrencyModel[]> {
    return await this.listCurrencyRepository.listAll()
  }
}
