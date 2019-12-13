const { Schema, model } = require('../database/index.js')

const CurrencySchema = new Schema({
    currency: {
        type: String,
        required: true,
        unique: true,
    }
},{
    timestamps: true
})

module.exports = model('Currency', CurrencySchema)