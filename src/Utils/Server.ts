import express, { Application } from 'express'
import cors from 'cors'
import morgan from 'morgan'

import { CurrencyRoutes } from 'Controllers/CurrencyController'
import { Redis } from './Redis/Redis'

export class Server {
  private routes = (app: Application) => {
    console.log('Loading routes::::')

    app.use('/api/currency', CurrencyRoutes())
  }

  private modules = (app: Application) => {
    console.log('Loading modules::::')

    app.use(express.json())
    app.use(cors())
  }

  private databaseConnection = async () => {
    console.log('Connecting to database::::')

    const redis = new Redis()
    await redis.initRedisConnection()
  }

  private midlewares = (app: Application) => {
    console.log('Loading middlewares::::')

    app.use(morgan(':method :url :response-time ms :status'))
  }

  init = async (): Promise<Application> => {
    const app = express()

    this.modules(app)
    this.midlewares(app)
    this.routes(app)

    await this.databaseConnection()

    return app
  }
}
