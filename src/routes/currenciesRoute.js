import { Router } from 'express'
import { currenciesController } from '../controllers/currenciesController.js'
import { validateSchema } from '../middlewares/validateSchema.js'
import newCurrencySchema from '../schemas/newCurrencySchema.js'

const currencyRouter = Router()

currencyRouter.get('/', currenciesController.getCurrencies)
currencyRouter.get('/:code', currenciesController.getCurrency)
currencyRouter.post('/', validateSchema(newCurrencySchema), currenciesController.createCurrency)
currencyRouter.delete('/:code', currenciesController.deleteCurrency)

export default currencyRouter
