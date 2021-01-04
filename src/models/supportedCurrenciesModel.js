const mongoose = require('mongoose');
const { Schema } = mongoose;

const supportedCurrenciesSchema = new Schema({
    currencies: [String]
});

const SupportedCurrencies = mongoose.model('SupportedCurrencies', supportedCurrenciesSchema);
module.exports = SupportedCurrencies;