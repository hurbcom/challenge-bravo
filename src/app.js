import express from 'express'
import { router } from './http/routes/routes.js'

export class App {
  constructor () {
    this.server = express()
    this.middleware()
    this.router()
  }

  middleware () {
    this.server.use(express.json())
    this.server.use(express.urlencoded({ extended: true }))
  }

  router () {
    this.server.get('/', (req, res) => {
      res.send({ message: 'Hello World' })
    })

    this.server.use(router)
  }
}
