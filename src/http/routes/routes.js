import { Router } from 'express'
import { ConvertCurrencyController } from '../controllers/convertCurrency.controller.js'
import { validatorSchemaMiddleware } from '../middleware/validatorSchema.middleware.js'
import { schemaValidatorConvert } from '../../utils/schemaValidator.js'

const router = Router()

router.get('/currency/convert', validatorSchemaMiddleware(schemaValidatorConvert, 'query'),
  (req, res, next) => {
    const convertCurrencyController = new ConvertCurrencyController()
    convertCurrencyController.handler(req, res, next)
  })

export { router }
