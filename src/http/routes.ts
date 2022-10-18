import { Router } from 'express'
import { currencyRouter } from '../modules/currency/http/currency.route'

const routes = Router()

routes.use('/currency', currencyRouter)

export default routes