import { CurrencyModel } from '../../../../domain/models/currency'

export interface UpsertCurrencyRepository{
    upsert (currency: CurrencyModel): Promise<boolean>
  }
