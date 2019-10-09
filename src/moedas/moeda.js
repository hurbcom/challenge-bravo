const restful = require('node-restful')
const mongoose = restful.mongoose

const moedaSchema = new mongoose.Schema({
    moeda: { type: String, required: true }
})

module.exports = restful.model('Moeda', moedaSchema)
