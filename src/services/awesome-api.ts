import axios, { AxiosResponse } from 'axios'
import Currencies from '../models/Currencies'

class AwesomeApi {
  public async GetCurrencies (): Promise <Currencies> {
    return axios.get('https://economia.awesomeapi.com.br/all')
      .then((response: AxiosResponse) => {
        response.data.BRL = {
          code: 'BRL',
          ask: '1'
        }
        const currencies: Currencies = response.data
        return currencies
      })
  }
}

export default new AwesomeApi()
