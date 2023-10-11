class AddSupportedCurrencies {
  #supportedCurrenciesRepository
  supportedCurrencies = ['EUR', 'BRL', 'BTC', 'ETH']

  /**
   *
   * @param {InstanceType} supportedCurrenciesRepository
   */
  constructor (supportedCurrenciesRepository) {
    this.#supportedCurrenciesRepository = supportedCurrenciesRepository
  }

  /**
   *
   * @param {Array} [supportedCurrencies] an array of supported currencies
   * @returns {boolean}
   */
  async execute (supportedCurrencies) {
    if (!supportedCurrencies) {
      supportedCurrencies = this.supportedCurrencies
    }

    await this.#supportedCurrenciesRepository.addSupportedCurrencies({ base: 'USD', supported_currencies: supportedCurrencies })

    return true
  }
}

export { AddSupportedCurrencies }
