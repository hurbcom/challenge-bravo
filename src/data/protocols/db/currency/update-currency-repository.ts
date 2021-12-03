import { CurrencyModel } from '../../../../domain/models/currency'

export interface UpdateCurrencyRepository{
    updateByShortName (shortName:string, update: CurrencyModel): Promise<boolean>
  }
