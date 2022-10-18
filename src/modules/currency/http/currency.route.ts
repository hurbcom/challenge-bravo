import { Router } from 'express'
import { CurrencyController } from '../controllers/currency.controller'
import { CreateCurrencyValidator } from '../resources/create-currency/middlewares/create-currency.validator.middleware'
import { CurrencyConversionValidator } from '../resources/currency-conversion/middlewares/currency-conversion-validator.middleware'

export const currencyRouter = Router()

const currencyController = new CurrencyController()
const currencyConversionValidator = new CurrencyConversionValidator()
const createCurrencyValidator = new CreateCurrencyValidator()

currencyRouter.get('/conversion', currencyConversionValidator.validateSchema, currencyController.currencyConversion)
currencyRouter.post('', createCurrencyValidator.validateSchema, currencyController.createCurrency)