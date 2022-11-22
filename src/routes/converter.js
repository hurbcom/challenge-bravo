const express = require('express')
const router = express.Router()
const controller = require('../controllers')
const utils = require('../utils')
const validation = require('../helpers/validator')
const HandledError = require('../helpers/HandledError')

router.get('/', async (req, res) => {
	try {
		const { from, to, amount, type } = req.query

		const params = {
			from,
			to,
			amount,
			type,
		}

		validation.validateQueryParamsToConverter(params)

		const response = await controller.converter.currencyConverter(params)

		res.status(200).json(response)
	} catch (err) {
		console.log(err)
		if (err instanceof HandledError) {
			res.status(err.statusCode).json(err.showError())
		} else {
			res.status(500).json(utils.defaultResponse(500, err.message))
		}
	}
})

module.exports = router
