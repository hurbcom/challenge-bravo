import express from 'express'
import cors from 'cors'
import cache from 'memory-cache'
import routes from './routes'
class App {
    public express: express.Application;

    public constructor () {
      this.express = express()
      this.middlewares()
      this.starterData()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private starterData (): void {
      cache.put('currencies','USD,BRL,EUR,BTC,ETH')
    }

    private routes (): void {
      this.express.use(routes)
    }
}

export default new App().express
