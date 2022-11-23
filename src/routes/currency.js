const express = require('express')
const router = express.Router()
const controller = require('../controllers')
const utils = require('../utils')
const HandledError = require('../helpers/HandledError')
const validation = require('../helpers/validator')
const { isEmpty } = require('lodash')

router.get('/list', async (req, res) => {
	try {
		const response = await controller.currency.listAllCurrencies()

		res.status(response.statusCode || 200).json(response)
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

		res.status(response.statusCode || 200).json(response)
	} catch (err) {
		if (err instanceof HandledError) {
			res.status(err.statusCode).json(err.showError())
		} else {
			res.status(500).json(utils.defaultResponse(500, err.message))
		}
	}
})

router.patch('/:currencyCode', async (req, res) => {
	try {
		const { currencyCode } = req.params
		const { body } = req

		if (isEmpty(body)) {
			throw new HandledError(400, 'O payload deve ser enviado')
		}

		const response = await controller.currency.updateCurrency(
			currencyCode,
			body
		)

		res.status(response.statusCode || 200).json(response)
	} catch (err) {
		if (err instanceof HandledError) {
			res.status(err.statusCode).json(err.showError())
		} else {
			res.status(500).json(utils.defaultResponse(500, err.message))
		}
	}
})

module.exports = router
