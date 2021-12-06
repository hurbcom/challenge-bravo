import { Router, Express } from 'express'
import currencyRoutes from '../routes/currency-routes'

export default (app:Express):void => {
  const router = Router()
  app.use(router)
  currencyRoutes(router)
}
