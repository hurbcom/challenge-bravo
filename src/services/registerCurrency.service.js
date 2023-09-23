import { AbstractApi } from '../http/client/abstractAp.js'
import { BadRequestError } from '../utils/apiError.js'

export class RegisterCurrencyService {
  #currencyRepository
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  /*
  currency {
    code: String,
    price: Number
  }
   */
  async execute (currency) {
    const currencyAlreadyRegistered = await this.#currencyRepository.getCurrencies(currency.code)
    if (currencyAlreadyRegistered) throw new BadRequestError('Currency already registered')
    if (!currency.price) {
      const abstractApi = new AbstractApi()
      currency = await abstractApi.getCurrencyByCode(currency.code)
      await this.#currencyRepository.updateSupportedCurrency(currency.code)
    }
    const response = await this.#currencyRepository.registerCurrency({ base: 'USD', ...currency })
    return response
  }
}
