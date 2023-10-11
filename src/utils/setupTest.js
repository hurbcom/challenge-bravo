import { makeCurrenciesApi } from '../../tests/make-currencies-api/make-currencies-api.js'
import { CurrencyMongoRepository } from '../database/currencyMongoRepository.js'

async function setupTest () {
  const currencyMongoRepository = new CurrencyMongoRepository()
  const arrayPromise = makeCurrenciesApi.map((currency) => {
    return currencyMongoRepository.updateCurrency(currency)
      .catch(e => e)
  })

  await Promise.all(arrayPromise)
    .catch(error => console.log(`Erro ao executar ${error}`))
}

export { setupTest }
