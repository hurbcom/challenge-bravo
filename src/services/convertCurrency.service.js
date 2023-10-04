import { NotFoundError } from '../utils/apiError.js'

export class ConvertCurrencyService {
  #currencyRepository

  /**
   *
   * @param {InstanceType} currencyRepository
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
    const { rates } = await this.#currencyRepository.getCurrencies()
    let priceFrom = 1
    if (from !== 'USD') {
      priceFrom = rates[from]
      if (!priceFrom) {
        throw new NotFoundError(`Currency not found: ${from}`)
      }
    }
    const usd = (amount / priceFrom)
    if (to === 'USD') {
      return Number(usd.toFixed(4))
    }
    const priceTo = rates[to]
    if (!priceTo) {
      throw new NotFoundError(`Currency not found: ${to}`)
    }
    const response = usd * priceTo

    return Number(response.toFixed(4))
  }
}
