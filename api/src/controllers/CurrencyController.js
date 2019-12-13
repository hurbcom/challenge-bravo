const Currency = require('../models/Currency')
const CurrencyService = require('../services/CurrencyService')

module.exports = {
    async index(req, res) {
        const { from, to, amount } = req.query
        try {
            const findFrom = await Currency.findOne({ currency: from })
            if (!findFrom) {
                return res.status(404).json({success: false, data: 'Currency is not supported'})
            }

            const findTo = await Currency.findOne({ currency: to })
            if (!findTo) {
                return res.status(404).json({success: false, data: 'Currency is not supported'})
            }

            const result = await CurrencyService.convert(from, to)
            const finalResult = (result * amount).toFixed(2)

            return res.json({success: true, data: finalResult})

        } catch (error) {
            return res.status(404).json({success: false, data: error})
        }
    },
    async store(req, res) {
        try {
            const response = await Currency.create(req.body)

            return res.json({success: true, data: response})
            
        } catch (error) {
            return res.status(404).json({success: false, data: error})
        }
    },
    async delete(req, res) {
        const { currency } = req.query
        try {
            await Currency.findOneAndDelete({currency})

            return res.json({success: true})
        } catch (error) {
            return res.status(404).json({success: false, data: error})
        }
    }
}