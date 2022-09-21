import { currenciesService } from '../services/currenciesService.js'

async function getCurrencies(req, res) {
	const currencies = await currenciesService.getCurrencies()

	res.status(200).send(currencies)
}

async function getCurrency(req, res) {
	const { code } = req.params

	const currency = await currenciesService.getCurrency(code.toUpperCase())

	res.status(200).send(currency)
}

async function createCurrency(req, res) {
	const { name, code, rate } = req.body

	await currenciesService.create(name, code, +rate)

	res.sendStatus(201)
}

async function deleteCurrency(req, res) {
	const { code } = req.params

	await currenciesService.deleteCurrency(code.toUpperCase())

	res.status(200).send("Currency deleted!")
}

export const currenciesController = {
	getCurrencies,
	getCurrency,
	createCurrency,
	deleteCurrency
}
