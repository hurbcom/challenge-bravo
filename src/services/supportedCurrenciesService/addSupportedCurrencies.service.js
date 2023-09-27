class AddSupportedCurrencies {
  #supportedCurrenciesRepository
  supportedCurrencies = ['EUR', 'BRL', 'BTC', 'ETH']
  constructor (supportedCurrenciesRepository) {
    this.#supportedCurrenciesRepository = supportedCurrenciesRepository
  }

  async execute (supportedCurrencies) {
    if (!supportedCurrencies) {
      supportedCurrencies = this.supportedCurrencies
    }

    await this.#supportedCurrenciesRepository.addSupportedCurrencies({ base: 'USD', supported_currencies: supportedCurrencies })

    return true
  }
}

export { AddSupportedCurrencies }
