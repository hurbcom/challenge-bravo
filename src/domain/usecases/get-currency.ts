import { CurrencyModel } from '../models/currency'

export interface GetCurrency{
    getByShortName (shortName:string): Promise<CurrencyModel>
}
