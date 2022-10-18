import { Router } from 'express'
import { CurrencyController } from '../controllers/currency.controller'
import { CurrencyConversionValidator } from '../resources/currency-conversion/middlewares/currency-conversion-validator.middleware'

export const currencyRouter = Router()

const currencyConversionController = new CurrencyController()
const currencyConversionValidator = new CurrencyConversionValidator()

currencyRouter.get('/conversion', currencyConversionValidator.validateSchema, currencyConversionController.currencyConversion)