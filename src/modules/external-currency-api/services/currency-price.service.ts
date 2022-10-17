import axios from 'axios'
import { CurrencyPriceResponseDTO } from '../dtos/currency-price.dto'

export class CurrencyPriceService {
  public async execute(fromCurrencyCode: string, toCurrencyCode: string): Promise<CurrencyPriceResponseDTO> {
    try {
      const currencyPriceResponse = await axios.get(`https://economia.awesomeapi.com.br/last/${fromCurrencyCode}-${toCurrencyCode}`)
      if(currencyPriceResponse.status != 200) return null
      const currencyPriceResponseKeys = Object.keys(currencyPriceResponse.data)
      return currencyPriceResponse.data[currencyPriceResponseKeys[0]] 
    } catch (error) { 
      return null 
    }
  }
}
