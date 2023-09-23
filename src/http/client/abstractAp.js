/* eslint-disable camelcase */
import axios from 'axios'
import { GetSupportedCurrencies } from '../../services/getSupportedCurrencies.service.js'
import { CurrencyMongoRepository } from '../../database/currencyMongoRepository.js'

export class AbstractApi {
  #request
  constructor (request = axios) {
    this.#request = request
  }

  async getCurrencies () {
    const currencyRepository = new CurrencyMongoRepository()
    const getSupportedCurrenciesService = new GetSupportedCurrencies(currencyRepository)
    const [{ supported_currencies }] = await getSupportedCurrenciesService.execute()
    const target = this.#toTarget(supported_currencies)

    const response = await this.#request.get(`https://exchange-rates.abstractapi.com/v1/live?target=${target}&api_key=df95a7b88370483a9ee7144a25cf89ef&base=USD`)

    return this.#toUpdateMongodb(response.data)
  }

  async getCurrencyByCode (code) {
    const response = await this.#request.get(`https://exchange-rates.abstractapi.com/v1/live?target=${code}&api_key=df95a7b88370483a9ee7144a25cf89ef&base=USD`)

    return this.#getCurrencyByCodeNormalized(code, response.data)
  }

  #toUpdateMongodb ({ base, exchange_rates }) {
    const currencies = []
    for (const key in exchange_rates) {
      const currency = {
        base,
        code: key,
        price: exchange_rates[key]
      }
      currencies.push(currency)
    }

    return currencies
  }

  #getCurrencyByCodeNormalized (code, { exchange_rates }) {
    const currency = {
      code,
      price: exchange_rates[code]
    }
    return currency
  }

  #toTarget (supportedCurrencies) {
    let target = ''
    // eslint-disable-next-line prefer-const
    for (let i in supportedCurrencies) {
      // eslint-disable-next-line eqeqeq
      if (i == supportedCurrencies.length - 1) {
        target += supportedCurrencies[i]
        return target
      }
      target += `${supportedCurrencies[i]}%2C`
    }
  }
}
