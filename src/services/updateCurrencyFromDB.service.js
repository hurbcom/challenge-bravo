export class UpdateCurrencyFromDBService {
  #currencyRepository
  #clientApi
  #cacheRepository

  /**
     *
     * @param {InstanceType} currencyRepository
     * @param {InstanceType} clientApi
     * @param {InstanceType} cacheRepository
     */
  constructor (currencyRepository, clientApi, cacheRepository) {
    this.#currencyRepository = currencyRepository
    this.#clientApi = clientApi
    this.#cacheRepository = cacheRepository
  }

  async execute () {
    try {
      const currencies = await this.#clientApi.getCurrencies()
      this.#cacheRepository.set('exchange_rates', JSON.stringify(currencies), 'EX', 10800)
      const currenciesToUpdateDB = await this.#clientApi.toUpdateMongodb(currencies)
      const arrayPromise = currenciesToUpdateDB.map((currency) => {
        return this.#currencyRepository.updateCurrency(currency).catch(e => e)
      })

      const resultUpdated = await Promise.all(arrayPromise)
        .catch(error => console.log(`Error when executing ${error}`))

      return resultUpdated
    } catch (error) {
      console.error(error.message)
    }
  }
}
