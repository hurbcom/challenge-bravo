import { CurrencyMongoRepository } from './database/currencyMongoRepository.js'
import { UpdateManyCurrencyService } from './services/updateCurrencyFromBD.service.js'
import { App } from './app.js'

const server = new App().server

const currencyMongoRepository = new CurrencyMongoRepository()
await currencyMongoRepository.connect()
const updateManyCurrencyService = new UpdateManyCurrencyService(currencyMongoRepository)

setInterval(async () => {
  await updateManyCurrencyService.execute()
}, 25 * 1000 * 60 * 60)

server.listen(3000, () => {
  console.log('server running at port 3000')
})
