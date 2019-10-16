import { Router } from 'express'

import CurrencyController from './controllers/CurrencyController'

const routes = Router()

routes.get('/currencies', CurrencyController.GetCurrencies) // Get possible currencies

export default routes
