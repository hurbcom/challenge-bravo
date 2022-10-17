import { Router } from 'express'
import { currencyReouter } from './modules/currency/http/currency.route'

const routes = Router()

routes.use('/currency', currencyReouter)

export default routes