import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { CurrencyRoutes } from 'Controllers/CurrencyController'
import { initRedisConnection } from './Redis'
import { populateCache } from 'Services/CurrencyService'

const routes = (app: Application) => {
  console.log('Loading routes::::')

  app.use('/api/currency', CurrencyRoutes())
}

const modules = (app: Application) => {
  console.log('Loading modules::::')

  app.use(express.json())
  app.use(cors())
}

const databaseConnection = async () => {
  console.log('Connecting to database::::')

  await initRedisConnection()
}

const loadCache = async () => {
  console.log('Loading cache::::')

  await populateCache()
}

const midlewares = (app: Application) => {
  console.log('Loading middlewares::::')

  app.use(morgan(':method :url :response-time ms :status'))
}

export const init = async () => {
  const app = express()

  modules(app)
  midlewares(app)
  routes(app)

  await databaseConnection()
  await loadCache()

  const port = process.env.PORT || 3000

  app.listen(port, () => {
    console.log('\n+=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+')
    console.log(`| Server started at: http://localhost:${port} |`)
    console.log('+=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-+\n')
  })
}
