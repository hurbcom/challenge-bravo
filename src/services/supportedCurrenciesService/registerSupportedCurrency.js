import { NotFoundError } from '../../utils/apiError.js'

class RegisterSupportedCurrency {
  #supportedCurrencyRepository
  #registerCurrencyService
  #resourceExtern
  constructor (supportedCurrenciesRepository, registerCurrencyService, resourceExtern) {
    this.#supportedCurrencyRepository = supportedCurrenciesRepository
    this.#registerCurrencyService = registerCurrencyService
    this.#resourceExtern = resourceExtern
  }

  async execute (code) {
    const currency = await this.#resourceExtern.getCurrencyByCode(code)

    if (!currency) {
      throw new NotFoundError(`Currency not found by code: ${code}`)
    }

    await this.#registerCurrencyService.execute(currency)
    const response = await this.#supportedCurrencyRepository.registerSupportedCurrency(code)

    return response
  }
}

export { RegisterSupportedCurrency }
