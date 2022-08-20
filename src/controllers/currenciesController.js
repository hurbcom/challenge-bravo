import { currenciesService } from '../services/currenciesService.js'

async function getCurrencies(req, res) {
	const currencies = await currenciesService.getCurrencies()

	res.status(200).send(currencies)
}

async function createCurrency(req, res) {
	const newCurrency = req.body

	await currenciesService.create(newCurrency)

	res.sendStatus(201)
}

export const currenciesController = {
	getCurrencies,
	createCurrency
}
