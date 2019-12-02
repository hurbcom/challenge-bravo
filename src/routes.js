import { Router } from 'express'

import CurrencyController from './controllers/CurrencyController'

const routes = Router()

routes.get('/currencies', CurrencyController.convert)
routes.get('/currencies/cached', CurrencyController.convertCached)
routes.post('/currencies', CurrencyController.add)
routes.delete('/currencies/:id', CurrencyController.remove)

export default routes
