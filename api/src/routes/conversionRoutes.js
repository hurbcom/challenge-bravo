const Router = require('@koa/router')
const {
  createConversionController,
} = require('../controllers/conversionController')

const router = new Router()
const conversionController = createConversionController()

router.get('/conversion', conversionController.findOne)

module.exports = { conversionRouter: router }
