/* eslint-disable no-unused-vars */
import { CurrencyRepository } from '../repositories/currencyRepository.js'

export class UpdateManyCurrencyService {
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
   * @param {object[]} currencies
   * @param {string} currencies.base
   * @param {string} currencies.code
   * @param {number} currencies.price
   * @returns {Promise<void>}
   */
  async execute (currencies) {
    const arrayPromise = currencies.map((currency) => {
      return this.#currencyRepository.updateCurrency(currency).catch(e => e)
    })

    await Promise.all(arrayPromise)
      .catch(error => console.log(`Error when executing ${error}`))
  }
}
