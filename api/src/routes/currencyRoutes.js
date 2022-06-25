const Router = require('@koa/router')
const {
  createCurrencyController,
} = require('../controllers/currencyController')

const router = new Router()
const currencyController = createCurrencyController()

router.get('/currencies', currencyController.find)
router.get('/currencies/:code', currencyController.findOne)
router.post('/currencies', currencyController.create)
router.put('/currencies/:code', currencyController.update)
router.del('/currencies/:code', currencyController.delete)

module.exports = router
