import { CurrencyModel } from '../../../../domain/models/currency'

export interface UpsertCurrency{
    upsert (currency: CurrencyModel): Promise<boolean>
  }
