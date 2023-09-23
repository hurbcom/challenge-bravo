class GetSupportedCurrencies {
  #currencyRepository
  constructor (currencyRepository) {
    this.#currencyRepository = currencyRepository
  }

  async execute () {
    const currencies = await this.#currencyRepository.getSupportedCurrencies()
    return currencies
  }
}

export { GetSupportedCurrencies }
