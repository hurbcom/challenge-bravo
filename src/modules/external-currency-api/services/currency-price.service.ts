import axios from 'axios'
import { CurrencyPriceResponseDTO } from '../dtos/currency-price.dto'

export class CurrencyPriceService {
  public async execute(fromCurrencyCode: string, toCurrencyCode: string): Promise<CurrencyPriceResponseDTO> {
    const currencyPriceResponse = await axios.get(`https://economia.awesomeapi.com.br/last/${fromCurrencyCode}-${toCurrencyCode}`)
    if(currencyPriceResponse.status != 200) throw new Error('Was not possible to find this currency price')
    const currencyPriceResponseKeys = Object.keys(currencyPriceResponse.data)
    return currencyPriceResponse.data[currencyPriceResponseKeys[0]]
  }
}
