const restful = require('node-restful')
const mongoose = restful.mongoose

const currencySchema = new mongoose.Schema({
    currency: { type: String, required: true }
})

currency = restful.model('Currency', currencySchema)

module.exports = { currency, currencySchema }
