/* eslint-disable camelcase */
import axios from 'axios'

export default class AbstractApi {
  #request
  constructor (request = axios) {
    this.#request = request
  }

  async getCurrencies () {
    const response = await this.#request.get('https://exchange-rates.abstractapi.com/v1/live?target=EUR%2CBRL%2CBTC%2CETH&api_key=df95a7b88370483a9ee7144a25cf89ef&base=USD')

    return this.#toUpdateMongodb(response.data)
  }

  #toUpdateMongodb ({ base, last_updated, exchange_rates }) {
    const currencies = []
    for (const key in exchange_rates) {
      const currency = {
        base,
        updated: last_updated,
        code: key,
        price: exchange_rates[key]
      }
      currencies.push(currency)
    }

    return currencies
  }
}
