const mongoose = require('../database/database')

const CurrencySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  isFictional: {
    type: Boolean,
    required: true
  },
  exchange_rates: [{
    type: Object,
    required: true
  }],
  updated_at: {
    type: Date,
    default: Date.now
  }
})

const Currency = mongoose.model('Currency', CurrencySchema);

module.exports = Currency;