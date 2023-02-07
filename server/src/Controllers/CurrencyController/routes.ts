import { Router } from 'express'
import { CurrencyController } from './index'

export const CurrencyRoutes = () => {
  const currencyController = new CurrencyController()
  const route = Router()

  route.get('/convert', currencyController.GetCurrencyByParameter)
  route.post('/new', currencyController.CreateNewCurrency)
  route.delete('/:coin', currencyController.RemoveCurrency)

  return route
}
