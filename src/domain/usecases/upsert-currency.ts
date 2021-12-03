import { CurrencyModel } from '../models/currency'

export interface UpsertCurrency{
    upsert (currency: CurrencyModel): Promise<boolean>
}
