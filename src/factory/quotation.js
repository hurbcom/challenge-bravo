const { round } = require('lodash')

/**
 * Realiza o calculo da conversão entre as moedas
 * @param {number} from Valor origem
 * @param {number} to Valor destino
 * @param {number} amount Valor a ser convertido
 * @returns {number} Valor convertido
 * @author Vinícius Nunes
 */
exports.converterAmount = (from, to, amount) => {
	const amountInUSD = from * amount
	const amountConverted = amountInUSD / to

	return round(amountConverted, 4)
}
