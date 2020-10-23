const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    currency: String,
    value: Boolean
},{
    timestamps: true,
});

module.exports = mongoose.model('CurrencyModel', CurrencySchema);