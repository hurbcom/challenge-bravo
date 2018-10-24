const { Router } = require('express')
const router = Router()
const converterController = require('../controllers/converter')

router.get('/', converterController.convert)
module.exports = router