import { Router } from 'express'

import CurrencyController from './controllers/CurrencyController'

const routes = Router()

// routes.get('/', CurrencyController. // Get converted value
routes.get('/currencies', CurrencyController.GetCurrencies) // Get possible currencies
routes.post('/currencies', CurrencyController.AddCurrency) // Add another currency
// routes.delete('/currencies', CurrencyController.removeCurrency) // Remove currency

export default routes
