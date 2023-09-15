import { makeCurrenciesApi } from '../../tests/make-currencies-api/make-currencies-api.js'
import CurrencyMongoRepository from '../database/currencyMongoRepository.js'

await CurrencyMongoRepository.connect('mongodb://root:root@localhost:27017')
const arrayPromise = makeCurrenciesApi.map((currency) => {
  return CurrencyMongoRepository.updateCurrency(currency)
    .catch(e => e)
})

await Promise.all(arrayPromise)
  .catch(error => console.log(`Erro ao executar ${error}`))

CurrencyMongoRepository.disconnect()
