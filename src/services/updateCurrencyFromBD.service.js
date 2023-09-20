import { AbstractApi } from '../http/client/abstractAp.js'

export class UpdateManyCurrencyService {
  #currencyRespository
  constructor (currencyRespository) {
    this.#currencyRespository = currencyRespository
  }

  async execute () {
    try {
      const abstractApi = new AbstractApi()
      const currencies = await abstractApi.getCurrencies()
      const arrayPromise = currencies.map((currency) => {
        return this.#currencyRespository.updateCurrency(currency).catch(e => e)
      })

      const resultUpdated = await Promise.all(arrayPromise)
        .catch(error => console.log(`Erro ao executar ${error}`))

      return resultUpdated
    } catch (error) {
      console.error(error.message)
    }
  }
}
