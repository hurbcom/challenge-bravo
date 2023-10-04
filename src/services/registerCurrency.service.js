import { BadRequestError } from '../utils/apiError.js'

export class RegisterCurrencyService {
  #currencyRepository

  /**
   *
   * @param {InstanceType} currencyRepository
   */
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  /*
  currency {
    code: String,
    price: Number
  }
   */
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

    const response = await this.#currencyRepository.registerCurrency({ base: 'USD', ...currency })
    return response
  }
}
