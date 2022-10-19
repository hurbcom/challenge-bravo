import express, { Application } from 'express'
import cors from 'cors'

import { CurrencyRoutes } from 'Controllers/CurrencyController'

const routes = (app: Application) => {
  app.use('/currency', CurrencyRoutes())
}

const modules = (app: Application) => {
  app.use(cors())
}

export const init = () => {
  const app = express()

  routes(app)
  modules(app)

  const port = 3000
  app.listen(port, () => {
    console.log(`Server started at: http://localhost:${port}`)
  })
}
