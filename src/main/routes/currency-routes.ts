import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddCurrencyController } from '../factories/controllers/add-currency/add-currency-controller-factory'

export default (router: Router): void => {
  router.post('/address', adaptRoute(makeAddCurrencyController()))
}
