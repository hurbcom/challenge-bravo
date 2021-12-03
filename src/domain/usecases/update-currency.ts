import { CurrencyModel } from '../models/currency'

export interface UpdateCurrency{
    update (shortName:string, updateData: CurrencyModel): Promise<boolean>
}
