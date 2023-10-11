/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import axios from 'axios'
import { SupportedCurrencyRepository } from '../../database/supportedCurrencyRepository/supportedCurrencyRepository.js'
import { RedisRepository } from '../../database/redis/redisRepository.js'

export class CurrencyApiClient {
  #request
  #cacheRepository
  constructor () {
    this.#request = axios
    this.#cacheRepository = new RedisRepository()
  }

  async getCurrencies () {
    const { data } = await this.#request.get('https://cdn.moeda.info/api/latest.json')

    return data
  }

  async getCurrencyByCode (code) {
    let rates = await JSON.parse(await this.#cacheRepository.get('exchange_rates'))
    this.#cacheRepository.disconnect()
    if (!rates) {
      const { data } = await this.#request.get('https://cdn.moeda.info/api/latest.json')
      rates = data
    }

    return this.#getCurrencyByCodeNormalized({ code, ...rates })
  }

  async normalizeToMongo ({ rates }) {
    const supportedCurrencyRepository = new SupportedCurrencyRepository()
    const [{ supported_currencies }] = await supportedCurrencyRepository.getSupportedCurrencies()
    const currencies = []
    for (const code of supported_currencies) {
      const currency = {
        base: 'USD',
        code,
        price: rates[code]
      }
      currencies.push(currency)
    }
    return currencies
  }

  #getCurrencyByCodeNormalized ({ code, rates }) {
    const currency = {
      code,
      price: rates[code]
    }
    return currency
  }
}
