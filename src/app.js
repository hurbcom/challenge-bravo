import express from 'express'
import { router } from './http/routes/routes.js'
import CurrencyMongoRepository from './database/currencyMongoRepository.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send({ message: 'Hello World' })
})

app.use(router)

await CurrencyMongoRepository.connect()
app.listen(3000, () => {
  console.log('server running at port 3000')
})
