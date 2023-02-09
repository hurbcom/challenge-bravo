import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { CurrencyRoutes } from 'Controllers/CurrencyController/routes'
import { Redis } from './Redis/Redis'
import { RouteNotFound } from './Middlewares/RouteNotFound'
import { corsOptions } from './Middlewares/Cors'
import { setHearders } from './Middlewares/setHearders'

export class Server {
  constructor() {
    return this
  }

  private routes = (app: Application) => {
    console.log('Loading routes::::')

    app.use('/api/currency', CurrencyRoutes())
    app.use('*', RouteNotFound)
  }

  private modules = (app: Application) => {
    console.log('Loading modules::::')

    app.use(express.json())
    app.use(setHearders)
    app.use(cors(corsOptions))
  }

  private databaseConnection = async () => {
    console.log('Connecting to database::::')

    await new Redis().initRedisConnection()
  }

  private midlewares = (app: Application) => {
    console.log('Loading middlewares::::')

    app.use(morgan(':method :url :response-time ms :status'))
  }

  init = async (): Promise<Application> => {
    const app = express()

    await this.databaseConnection()

    this.modules(app)
    this.midlewares(app)
    this.routes(app)

    return app
  }
}
