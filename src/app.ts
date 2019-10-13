import express from 'express'
import cors from 'cors'
import cache from 'memory-cache'

class App {
    public express: express.Application;

    public constructor () {
      this.express = express()
      this.middlewares()
      this.starterCurrencies()
      this.routes()
    }

    private middlewares (): void {
      this.express.use(express.json())
      this.express.use(cors())
    }

    private starterCurrencies (): void {
      cache.put('currencies', ['USD', 'BRL', 'EUR', 'BTC', 'ETH'])
    }

    private routes (): void {
      this.express.get('/', (req, res) => res.send('teste'))
    }
}

export default new App().express
