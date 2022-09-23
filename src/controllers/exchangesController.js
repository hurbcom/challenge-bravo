import { exchangeService } from '../services/exchangesService.js'

async function makeExchange(req, res) {
	const { from, to, amount } = req.query

	const conversion = await exchangeService.convert(
		from.toUpperCase(),
		to.toUpperCase(),
		+amount
	)

	res.status(200).send(conversion)
}

export const exchangeController = {
	makeExchange
}
