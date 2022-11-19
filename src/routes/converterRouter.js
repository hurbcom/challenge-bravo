const express = require('express')
const router = express.Router()
const { currencyConverter } = require('../controllers/quotation')

router.get('/', async (req, res) => {
	try {
		const response = await currencyConverter('USD', 'BRL', 5.9)

		return res.staus(200).json(response)
	} catch (error) {
		return res.status(500).json('Erro')
	}
})

module.exports = router
