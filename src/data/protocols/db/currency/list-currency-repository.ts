import { CurrencyModel } from '../../../../domain/models/currency'

export interface ListCurrencyRepository{
    listAll (): Promise<Array<CurrencyModel>>
}
