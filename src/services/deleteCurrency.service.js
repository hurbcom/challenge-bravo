export class DeleteCurrencyService {
  #currencyRepository
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  /*
  code: string
   */
  async execute (code) {
    const currency = await this.#currencyRepository.getCurrencies(code)
    if (!currency) throw new Error('Currency not found')

    await this.#currencyRepository.deleteCurrency(code.toUpperCase())

    return true
  }
}
