const mongoose = require('mongoose');
const { Schema } = mongoose;

const currencySchema = new Schema({
  type: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('currency', currencySchema);