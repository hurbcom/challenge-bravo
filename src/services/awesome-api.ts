import axios, { AxiosResponse } from 'axios'

class AwesomeApi {
  public async GetCurrencies (): Promise <AxiosResponse> {
    return axios.get('https://economia.awesomeapi.com.br/all')
      .then((response: AxiosResponse) => {
        response.data.BRL = null
        return response.data
      })
  }
}

export default new AwesomeApi()
