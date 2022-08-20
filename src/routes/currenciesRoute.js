import { Router } from 'express'
import { currenciesController } from '../controllers/currenciesController.js'

const currencyRouter = Router()

currencyRouter.get('/currencies', currenciesController.getCurrencies)
currencyRouter.post('/currencies', currenciesController.createCurrency)

export default currencyRouter
