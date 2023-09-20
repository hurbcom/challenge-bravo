import CurrencyMongoRepository from './database/currencyMongoRepository.js'
import { UpdateManyCurrencyService } from './services/updateCurrencyFromBD.service.js'
import { App } from './app.js'

const server = new App().server

await CurrencyMongoRepository.connect()
const updateManyCurrencyService = new UpdateManyCurrencyService(CurrencyMongoRepository)
setInterval(async () => {
  console.log('hi')
  await updateManyCurrencyService.execute()
}, 25 * 1000 * 60 * 60)

server.listen(3000, () => {
  console.log('server running at port 3000')
})
