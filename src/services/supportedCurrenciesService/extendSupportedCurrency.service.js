import { NotFoundError } from '../../utils/apiError.js'

class ExtendSupportedCurrencyService {
  #supportedCurrencyRepository
  #registerCurrencyService
  #resourceExtern
  /**
   *
   * @param {InstanceType} supportedCurrenciesRepository
   * @param {InstanceType} registerCurrencyService
   * @param {InstanceType} resourceExtern
   */
  constructor (supportedCurrenciesRepository, registerCurrencyService, resourceExtern) {
    this.#supportedCurrencyRepository = supportedCurrenciesRepository
    this.#registerCurrencyService = registerCurrencyService
    this.#resourceExtern = resourceExtern
  }

  /**
   *
   * @param {Uppercase<string>} code
   * @returns {boolean}
   */
  async execute (code) {
    const currency = await this.#resourceExtern.getCurrencyByCode(code)

    if (!currency) {
      throw new NotFoundError(`Currency not found by code: ${code}`)
    }

    await this.#registerCurrencyService.execute(currency)
    await this.#supportedCurrencyRepository.registerSupportedCurrency(code)

    return true
  }
}

export { ExtendSupportedCurrencyService }
