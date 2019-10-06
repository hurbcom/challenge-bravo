const mongoose = require('mongoose');

const Currency = mongoose.Schema({
    currencyName: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Currency', Currency);