const { getLastQuotation } = require('../../api/quotation')

exports.currencyConverter = async (from, to, value) => {
	const res = await getLastQuotation(from, to)

	return 'ok'
}
