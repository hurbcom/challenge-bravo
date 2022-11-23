const { model, Schema } = require('mongoose')

const currencySchema = new Schema(
	{
		name: { type: String, require: true },
		code: { type: String, require: true, unique: true },
		quotation: {
			buy: { type: Number, require: true },
			sell: { type: Number, require: true },
		},
		origin: { type: String, enum: ['API', 'MANUAL'], default: 'MANUAL' },
	},
	{ timestamps: true }
)

const currency = model('Currency', currencySchema)
module.exports = currency
