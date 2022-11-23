const express = require('express')
const router = express.Router()
const controller = require('../controllers')
const utils = require('../utils')
const HandledError = require('../helpers/HandledError')
const validation = require('../helpers/validator')

router.get('/list', async (req, res) => {
	try {
		const response = await controller.currency.listAllCurrencies()

		res.status(200).json(response)
	} catch (err) {
		if (err instanceof HandledError) {
			res.status(err.statusCode).json(err.showError())
		} else {
			res.status(500).json(utils.defaultResponse(500, err.message))
		}
	}
})

router.post('/', async (req, res) => {
	try {
		const { body } = req

		validation.validateAddCurrencyPaylaod(body)

		const response = await controller.currency.addCurrency(body)

		res.status(200).json(response)
	} catch (err) {
		if (err instanceof HandledError) {
			res.status(err.statusCode).json(err.showError())
		} else {
			res.status(500).json(utils.defaultResponse(500, err.message))
		}
	}
})

module.exports = router
