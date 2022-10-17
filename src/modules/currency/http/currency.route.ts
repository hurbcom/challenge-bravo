import { Router } from 'express'
import { CurrencyController } from '../controllers/currency.controller'
import { CurrencyConversionValidator } from '../middlewares/currency-conversion-validator.middleware'

export const currencyReouter = Router()

const currencyConversionController = new CurrencyController()
const currencyConversionValidator = new CurrencyConversionValidator()

currencyReouter.get('/conversion', currencyConversionValidator.validateSchema, currencyConversionController.convertCurrency)