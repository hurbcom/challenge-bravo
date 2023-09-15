export class RegisterCurrencyService {
  #currencyRepository
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  /*
  currency {
    abbreviation: String,
    price: Number
  }
   */
  async execute (currency) {
    const currencyAlreadyRegistered = await this.#currencyRepository.getCurrencies(currency.code)
    if (currencyAlreadyRegistered) throw new Error('Currency already registered')

    try {
      const response = await this.#currencyRepository.registerCurrency({ base: 'USD', ...currency })

      return response
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
