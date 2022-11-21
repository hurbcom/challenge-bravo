const coinModel = require('../models/coin')

exports.findAllByOrigin = (origin) => {
	return coinModel
		.find({
			origin: origin,
		})
		.then((doc) => {
			return doc
		})
		.catch((err) => {
			console.log(
				`Não foi possível obter a lista de moedas por origem: ${err.message}`
			)
			throw err
		})
}
