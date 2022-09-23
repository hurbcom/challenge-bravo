import { Router } from 'express'
import { exchangeController } from '../controllers/exchangesController.js'

const exchangeRouter = Router()

exchangeRouter.post('/', exchangeController.makeExchange)

export default exchangeRouter