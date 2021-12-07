import { CurrencyModel } from '../../domain/models/currency'
import { ListCurrencies } from '../../domain/usecases/list-currencies'
import { HTTPClient } from './protocols/http-client'

export class FreeCurrencyAPIService implements ListCurrencies {
  constructor (protected readonly http:HTTPClient, private readonly apiKey:string) {}
  private parseToCurrency (object:any):CurrencyModel[] {
    const currencies:Array<CurrencyModel> = []
    Object.keys(object).forEach((key) => {
      currencies.push({ shortName: key, USDvalue: Number.parseFloat(object[key]) })
    })
    return currencies
  }

  async list (): Promise<CurrencyModel[]> {
    const serviceResponse = await this.http.call('/api/v2/latest?apikey=' + this.apiKey, 'GET')
    if (serviceResponse.statusCode === 200) {
      return this.parseToCurrency(serviceResponse.body.data)
    }
    return []
  }
}
