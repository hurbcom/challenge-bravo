const mongoose = require('mongoose');

const CurrencySchema = new mongoose.Schema({
    currency: String
}, {
    timestamps: true,
    useUnifiedTopology: true
});

module.exports = mongoose.model('Currency', CurrencySchema);