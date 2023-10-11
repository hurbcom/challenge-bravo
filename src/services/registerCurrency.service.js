import { BadRequestError } from '../utils/apiError.js'
import {CurrencyRepository} from '../repositories/currencyRepository.js'

export class RegisterCurrencyService {
  #currencyRepository

  /**
   *
   * @param {InstanceType< new CurrencyRepository>} currencyRepository
   */
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }
  /**
   *
   * @param {object} currency
   * @param {Uppercase<string>} currency.code
   * @param {number} currency.price
   * @returns {Promise<object>}
   */
  async execute (currency) {
    const currencyAlreadyRegistered = await this.#currencyRepository.getCurrencies(currency.code)
    if (currencyAlreadyRegistered) throw new BadRequestError('Currency already registered')

    await this.#currencyRepository.registerCurrency({ base: 'USD', ...currency })
    return currency
  }
}
