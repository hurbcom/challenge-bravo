import { Router } from 'express'
import { CurrencyController } from '../controllers/currency.controller'
import { CurrencyConversionValidator } from '../middlewares/currency-conversion-validator.middleware'

export const currencyRouter = Router()

const currencyConversionController = new CurrencyController()
const currencyConversionValidator = new CurrencyConversionValidator()

currencyRouter.get('/conversion', currencyConversionValidator.validateSchema, currencyConversionController.convertCurrency)