const mongoose = require('mongoose');
const { Schema } = mongoose;

const currencySchema = new Schema({
    alphaCode: String,
    rates: {type: Map,
            of: String}
});

const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;