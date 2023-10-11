/* eslint-disable prefer-const */
/* eslint-disable camelcase */
import axios from 'axios'
import { SupportedCurrencyRepository } from '../../database/supportedCurrencyRepository/supportedCurrencyRepository.js'
import { RedisRepository } from '../../database/redis/redisRepository.js'
import 'dotenv/config'

export class AbstractApi {
  #request
  constructor (request = axios) {
    this.#request = request
  }

  async getCurrencies () {
    const { data } = await this.#request.get(`https://exchange-rates.abstractapi.com/v1/live?api_key=${process.env.ABSTRACT_API_KEY}&base=USD`)
    return data
  }

  async getCurrencyByCode (code) {
    const redisRepository = new RedisRepository()
    let rates = await JSON.parse(await redisRepository.get('exchange_rates'))
    redisRepository.disconnect()
    if (!rates) {
      console.log('hi')
      const { data } = await this.#request.get(`https://exchange-rates.abstractapi.com/v1/live?target=${code}&api_key=df95a7b88370483a9ee7144a25cf89ef&base=USD`)
      rates = data
    }

    return this.#getCurrencyByCodeNormalized(code, rates)
  }

  async toUpdateMongodb ({ base, exchange_rates }) {
    const supportedCurrencyRepository = new SupportedCurrencyRepository()
    const [{ supported_currencies }] = await supportedCurrencyRepository.getSupportedCurrencies()
    const currencies = []
    for (let code of supported_currencies) {
      const currency = {
        base,
        code,
        price: exchange_rates[code]
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
