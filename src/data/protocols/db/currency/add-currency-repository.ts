import { CurrencyModel } from '../../../../domain/models/currency'

export interface AddCurrencyRepository{
    add (currency: CurrencyModel): Promise<boolean>
  }
