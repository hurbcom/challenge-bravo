const mongoose = require('mongoose');

const validCoin = new mongoose.Schema({
  validCoins: Array,
  ip: String,
  creationDate: Date,
  updateDate: Date,
});

const validCoins = mongoose.model('validCoin', validCoin, 'validCoin');

module.exports.validCoins = validCoins;
