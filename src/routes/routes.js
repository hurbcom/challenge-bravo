const routes = require('express').Router()
const validator = require('express-joi-validation').createValidator({})

const CurrencyController = require('../api/controllers/CurrencyController')
const ConvertController = require('../api/controllers/ConvertController')
const Validation =  require('../validation/validation')

// Currency routes
routes.post('/', validator.query(Validation.querySchema), ConvertController.convert)
routes.put('/', validator.body(Validation.bodySchema), CurrencyController.create)
routes.delete('/:id',  validator.params(Validation.paramSchema), CurrencyController.delete)
routes.get('/', CurrencyController.findAll)

module.exports = routes