import { CurrencyModel } from '../../../../domain/models/currency'

export interface GetCurrencyRepository{
    getByShortName (shortName:string): Promise<CurrencyModel>
}
