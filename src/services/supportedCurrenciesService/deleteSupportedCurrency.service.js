class DeleteSupportedCurrencyService {
  #supportedCurrenciesRepository
  #deleteCurrencyService
  constructor (supportedCurrenciesRepository, deleteCurrencyService) {
    this.#supportedCurrenciesRepository = supportedCurrenciesRepository
    this.#deleteCurrencyService = deleteCurrencyService
  }

  async execute (code) {
    await this.#deleteCurrencyService.execute(code)
    await this.#supportedCurrenciesRepository.deleteSupportedCurrency(code)

    return true
  }
}

export { DeleteSupportedCurrencyService }
