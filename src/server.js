import { CurrencyMongoRepository } from './database/currencyMongoRepository.js'
import { UpdateCurrencyFromDBService } from './services/updateCurrencyFromDB.service.js'
import { App } from './app.js'

const server = new App().server

const currencyMongoRepository = new CurrencyMongoRepository()
await currencyMongoRepository.connect()
const updateCurrencyFromDBService = new UpdateCurrencyFromDBService(currencyMongoRepository)

setInterval(async () => {
  await updateCurrencyFromDBService.execute()
}, 25 * 1000 * 60 * 60)

server.listen(3000, () => {
  console.log('server running at port 3000')
})
