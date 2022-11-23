/**
 * Fatora o resultado do banco para uma lista de Moedas
 * @param {Document[]} docs Resultado da busca no Mongo
 * @returns {Array} Lista de moedas ['BRL', 'USD']
 * @author Vinícius Nunes
 */
exports.formatCurrencyCodesToResponse = (docs) => {
	return docs.map((currency) => {
		return currency.code
	})
}
