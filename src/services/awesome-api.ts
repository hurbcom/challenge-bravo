import axios, { AxiosResponse } from 'axios'
// import axios, { AxiosInstance } from 'axios'

class AwesomeApi {
  public async GetCurrencies (): Promise <AxiosResponse> {
    return axios.get('https://economia.awesomeapi.com.br/all')
      .then((response: AxiosResponse) => response.data)
  }
}

export default new AwesomeApi()
