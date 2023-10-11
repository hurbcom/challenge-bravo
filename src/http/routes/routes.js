import { Router } from 'express'
import { ConvertCurrencyController } from '../controllers/convertCurrency.controller.js'
import { RegisterCurrencyController } from '../controllers/registerCurrency.controller.js'
import { DeleteCurrencyController } from '../controllers/deleteCurrency.controller.js'
import { ExtendSupportedCurrencyController } from '../controllers/supportedCurrency/extendSupportedCurrency.controller.js'
import { DeleteSupportedCurrencyController } from '../controllers/supportedCurrency/deleteSupportedCurrency.controller.js'
import { validatorSchemaMiddleware } from '../middleware/validatorSchema.middleware.js'
import { schemaValidatorConvert, schemaValidatorRegister } from '../../utils/schemaValidator.js'
import { errorHandlerMiddleware } from '../middleware/errorHandler.middleware.js'

const router = Router()

router.get('/currency/convert', validatorSchemaMiddleware(schemaValidatorConvert, 'query'),
  (req, res, next) => {
    const convertCurrencyController = new ConvertCurrencyController()
    convertCurrencyController.handler(req, res, next)
  }
)
router.post('/currency', validatorSchemaMiddleware(schemaValidatorRegister, 'body'), new RegisterCurrencyController().handler)
router.delete('/currency/:code', new DeleteCurrencyController().handler)

router.post('/currency/supported-currency/', new ExtendSupportedCurrencyController().handler)
router.delete('/currency/supported-currency/:code', new DeleteSupportedCurrencyController().handler)

router.use(errorHandlerMiddleware)

export { router }
