import { CurrencyModel } from '../models/currency'

export interface ListCurrencies{
    list():Promise<Array<CurrencyModel>>
}
