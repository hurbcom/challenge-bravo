import CurrencyMongoRepository from './database/currencyMongoRepository.js'
import { App } from './app.js'

const server = new App().server

await CurrencyMongoRepository.connect()
server.listen(3000, () => {
  console.log('server running at port 3000')
})
