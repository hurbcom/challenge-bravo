import { createInstanciCurrencyMongoRepository } from '../database/currencyMongoRepository.js'

try {
  const currencyRepository = createInstanciCurrencyMongoRepository()

  await currencyRepository.connect()
  currencyRepository.setCollection('currency')

  let response = await currencyRepository.getCurrencies()
  console.log(response)

  currencyRepository.setCollection('supported_currencies')

  response = await currencyRepository.getCurrencies()
  console.log(response)

  currencyRepository.disconnect()
} catch (error) {
  console.error(error)
}
