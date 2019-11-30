import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import routes from './routes'
import logger from './services/logger'
import sendError from './middlewares/sendError'

class App {
  constructor () {
    this.app = express()

    this.middlewares()
    this.routes()
  }

  middlewares () {
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(morgan('combined', { stream: logger.stream }))
    this.app.use(sendError)
  }

  routes () {
    this.app.use(routes)
  }
}

export default new App().app
