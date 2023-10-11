import { CurrencyMongoRepository } from '../database/currencyMongoRepository.js'
import { SupportedCurrencyRepository } from '../database/supportedCurrencyRepository/supportedCurrencyRepository.js'
import { UpdateManyCurrencyService } from '../services/updateManyCurrency.service.js'
import { AddSupportedCurrencies } from '../services/supportedCurrenciesService/addSupportedCurrencies.service.js'
import { Connection } from '../database/connection/connection.js'
import { CurrencyApiClient } from '../http/client/currencyApi.client.js'
import { RedisRepository } from '../database/redis/redisRepository.js'

await Connection.connect()

// repositories
const currencyRepository = new CurrencyMongoRepository()
const supportedCurrencyRepository = new SupportedCurrencyRepository()
const redisRepository = new RedisRepository()

// client api
const currencyApiClient = new CurrencyApiClient()

// services
const addSupportedCurrencies = new AddSupportedCurrencies(supportedCurrencyRepository)

const updateManyCurrency = new UpdateManyCurrencyService(currencyRepository)
const currencies = await currencyApiClient.getCurrencies()

export async function setupInit () {
  redisRepository.set('exchange_rates', JSON.stringify(currencies), 'EX', 10800)
  redisRepository.disconnect()
  await addSupportedCurrencies.execute()
  await updateManyCurrency.execute(await currencyApiClient.normalizeToMongo(currencies))
}
