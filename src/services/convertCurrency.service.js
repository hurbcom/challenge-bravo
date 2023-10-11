// eslint-disable-next-line no-unused-vars
import { CurrencyRepository } from '../repositories/currencyRepository.js'
import { NotFoundError } from '../utils/apiError.js'

export class ConvertCurrencyService {
  #currencyRepository

  /**
   *
   * @param {InstanceType<new CurrencyRepository>} currencyRepository
   */
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  /**
   *
   * @param {object} request
   * @param {string} request.from
   * @param {string} request.to
   * @param {number} request.amount
   * @returns {Promise<number>}
   */
  async execute (request) {
    const { from, to, amount } = request
    if (from === to) {
      return amount
    }
    const currencies = await this.#currencyRepository.getCurrencies()

    const fromCurrency = currencies.find(currency => currency.code === from)
    if (!fromCurrency) throw new NotFoundError(`Currency not found: ${from}`)

    const usd = (amount / fromCurrency.price)
    if (to === 'USD') {
      return Number(usd.toFixed(4))
    }

    const toCurrency = currencies.find(currency => currency.code === to)
    if (!toCurrency) {
      throw new NotFoundError(`Currency not found: ${to}`)
    }

    const response = usd * toCurrency.price

    return Number(response.toFixed(4))
  }
}
