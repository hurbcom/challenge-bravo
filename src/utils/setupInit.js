import { CurrencyMongoRepository } from '../database/currencyMongoRepository.js'
import { SupportedCurrencyRepository } from '../database/supportedCurrencyRepository/supportedCurrencyRepository.js'
import { UpdateCurrencyFromDBService } from '../services/updateCurrencyFromDB.service.js'
import { AddSupportedCurrencies } from '../services/supportedCurrenciesService/addSupportedCurrencies.service.js'
import { RedisRepository } from '../database/redis/redisRepository.js'
import { AbstractApi } from '../http/client/abstractAp.js'
import { Connection } from '../database/connection/connection.js'

await Connection.connect()

// repositories
const currencyRepository = new CurrencyMongoRepository()
const supportedCurrencyRepository = new SupportedCurrencyRepository()
const redisRepository = new RedisRepository()

// client api
const clientApi = new AbstractApi()

// services
const updateCurrencyFromDBService = new UpdateCurrencyFromDBService(currencyRepository, clientApi, redisRepository)
const addSupportedCurrencies = new AddSupportedCurrencies(supportedCurrencyRepository)

export async function setupInit () {
  await addSupportedCurrencies.execute()
  await updateCurrencyFromDBService.execute()
}
