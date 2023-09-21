import express from 'express'
import { router } from './http/routes/routes.js'
import { errorHandler } from './http/middleware/errorHandler.js'
import swaggerUi from 'swagger-ui-express'
import { readFile } from 'node:fs/promises'

export class App {
  constructor () {
    this.server = express()
    this.middleware()
    this.router()
    this.errorHandler()
  }

  middleware () {
    this.server.use(express.json())
    this.server.use(express.urlencoded({ extended: true }))
  }

  async router () {
    const swaggerDocs = JSON.parse(await readFile('src/http/doc/swagger.json', 'utf-8'))
    this.server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
    this.server.use(router)
  }

  errorHandler () {
    this.server.use(errorHandler)
  }
}
