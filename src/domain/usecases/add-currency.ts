import { CurrencyModel } from '../models/currency'

export interface AddCurrency{
    add (currency: CurrencyModel): Promise<boolean>
}
