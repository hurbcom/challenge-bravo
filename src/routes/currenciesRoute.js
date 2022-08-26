import { Router } from 'express'
import { currenciesController } from '../controllers/currenciesController.js'
import { validateSchema } from '../middlewares/validateSchema.js'
import newCurrencySchema from '../schemas/newCurrencySchema.js'

const currencyRouter = Router()

currencyRouter.get('/currencies', currenciesController.getCurrencies)
currencyRouter.get('/currencies/:code', currenciesController.getCurrency)
currencyRouter.post('/currencies', validateSchema(newCurrencySchema), currenciesController.createCurrency)

export default currencyRouter
