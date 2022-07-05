const mongoose = require('../database/database')

const CurrencySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Number,
    required: true
  }
})

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;