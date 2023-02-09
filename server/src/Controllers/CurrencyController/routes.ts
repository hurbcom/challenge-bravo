import { Response, Router } from 'express'
import { CurrencyController } from './index'
import * as T from './types'

export const CurrencyRoutes = () => {
  const currencyController = new CurrencyController()
  const route = Router()

  route.get('/convert', (req: T.TGetCurrencyByParameter, res: Response) =>
    currencyController.GetCurrencyByParameter(req, res)
  )
  route.post('/new', (req: T.TCreateCurrency, res: Response) =>
    currencyController.CreateNewCurrency(req, res)
  )
  route.patch('/update/:coin', (req: T.TUpdateCurrency, res: Response) =>
    currencyController.UpdateCurrency(req, res)
  )
  route.delete('/:coin', (req: T.TDeleteCurrency, res: Response) =>
    currencyController.RemoveCurrency(req, res)
  )

  return route
}
