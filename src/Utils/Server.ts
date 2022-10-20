import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { CurrencyRoutes } from 'Controllers/CurrencyController'

const routes = (app: Application) => {
  app.use('/api/currency', CurrencyRoutes())
}

const modules = (app: Application) => {
  app.use(express.json())
  app.use(cors())
}

const midlewares = (app: Application) => {
  app.use(morgan(':method :url :response-time ms'))
}

export const init = () => {
  const app = express()

  modules(app)
  midlewares(app)
  routes(app)

  const port = 3000
  app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`)
  })
}
