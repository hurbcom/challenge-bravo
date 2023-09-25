import { CurrencyMongoRepository } from './database/currencyMongoRepository.js'
import { UpdateCurrencyFromDBService } from './services/updateCurrencyFromDB.service.js'
import { App } from './app.js'
import { Connection } from './database/connection/connection.js'

const server = new App().server
await Connection.connect()
const currencyMongoRepository = new CurrencyMongoRepository()
const updateCurrencyFromDBService = new UpdateCurrencyFromDBService(currencyMongoRepository)

setInterval(async () => {
  await updateCurrencyFromDBService.execute()
}, 25 * 1000 * 60 * 60)

server.listen(3000, () => {
  console.log('server running at port 3000')
})
