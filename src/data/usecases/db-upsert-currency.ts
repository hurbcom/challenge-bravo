import { CurrencyModel } from '../../domain/models/currency'
import { UpsertCurrency } from '../../domain/usecases/upsert-currency'
import { UpsertCurrencyRepository } from '../protocols/db/currency/upsert-currency-repository'

export class DbUpsertCurrency implements UpsertCurrency {
  constructor (
        private readonly upsertCurrencyRepository: UpsertCurrencyRepository
  ) {}

  async upsert (currency: CurrencyModel): Promise<boolean> {
    return await this.upsertCurrencyRepository.upsert({ ...currency })
  }
}
