const mongoose = require('mongoose');
const { Schema } = mongoose;

const availableCurrenciesSchema = new Schema({
    currencies: [String]
});

const AvailableCurrencies = mongoose.model('AvailableCurrencies', availableCurrenciesSchema);
module.exports = AvailableCurrencies;