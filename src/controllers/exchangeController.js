import { exchangeService } from '../services/exchangeService.js'

async function makeExchange(req, res) {
	const { from, to, amount } = req.query

	const conversion = await exchangeService.convert(from, to, amount)

	res.status(200).send(conversion)
}

export const exchangeController = {
	makeExchange
}
