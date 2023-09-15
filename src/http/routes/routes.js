import { Router } from 'express'
import { ConvertCurrencyController } from '../controllers/convertCurrency.controller.js'

const router = Router()

router.get('/currency/convert', (req, res, next) => {
  const convertCurrencyController = new ConvertCurrencyController()
  convertCurrencyController.handler(req, res, next)
})

export { router }
