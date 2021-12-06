import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddCurrencyController } from '../factories/controllers/add-currency/add-currency-controller-factory'
import { makeUpdateCurrencyController } from '../factories/controllers/update-currency/update-currency-controller-factory'

export default (router: Router): void => {
  router.post('/currency', adaptRoute(makeAddCurrencyController()))
  router.patch('/currency/:shortName', adaptRoute(makeUpdateCurrencyController()))
}
