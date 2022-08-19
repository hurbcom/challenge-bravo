import { Router } from 'express'
import { exchangeController } from '../controllers/exchangeController.js'

const exchangeRouter = Router()

exchangeRouter.post('/exchange', exchangeController.makeExchange)

export default exchangeRouter