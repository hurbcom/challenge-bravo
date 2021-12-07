import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddCurrencyController } from '../factories/controllers/add-currency/add-currency-controller-factory'
import { makeDeleteCurrencyController } from '../factories/controllers/delete-currency/delete-currency-controller-factory'
import { makeGetCurrencyController } from '../factories/controllers/get-currency/get-currency-controller'
import { makeUpdateCurrencyController } from '../factories/controllers/update-currency/update-currency-controller-factory'

export default (router: Router): void => {
  router.post('/currency', adaptRoute(makeAddCurrencyController()))
  router.patch('/currency/:shortName', adaptRoute(makeUpdateCurrencyController()))
  router.get('/currency/:shortName?', adaptRoute(makeGetCurrencyController()))
  router.delete('/currency/:shortName', adaptRoute(makeDeleteCurrencyController()))
}
