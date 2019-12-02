import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import SwaggerUi from 'swagger-ui-express'

import routes from './routes'
import logger from './services/logger'
import sendError from './middlewares/sendError'
import SwaggerSpec from './config/swagger'

class App {
  constructor () {
    this.app = express()

    this.middlewares()
    this.routes()

    this.loadSwagger()
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

  loadSwagger () {
    this.app.use('/api-doc', SwaggerUi.serve, SwaggerUi.setup(SwaggerSpec))
  }
}

export default new App().app
