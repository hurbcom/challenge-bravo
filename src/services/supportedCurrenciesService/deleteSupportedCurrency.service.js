class DeleteSupportedCurrencyService {
  #supportedCurrenciesRepository
  #deleteCurrencyService

  /**
   *
   * @param {InstanceType} supportedCurrenciesRepository
   * @param {InstanceType} deleteCurrencyService
   */
  constructor (supportedCurrenciesRepository, deleteCurrencyService) {
    this.#supportedCurrenciesRepository = supportedCurrenciesRepository
    this.#deleteCurrencyService = deleteCurrencyService
  }

  /**
   *
   * @param {Uppercase<string>} code
   * @returns {boolean}
   */
  async execute (code) {
    await this.#deleteCurrencyService.execute(code)
    await this.#supportedCurrenciesRepository.deleteSupportedCurrency(code)

    return true
  }
}

export { DeleteSupportedCurrencyService }
