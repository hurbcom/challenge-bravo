const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CurrencySchema = new Schema({
    currency: { type: String, unique: true, required: true, max: 5 },
    usd_value: { type: Number, required: true },
}, { collection: 'currencies' });

module.exports = mongoose.model('Currency', CurrencySchema);