const mongoose = require('mongoose');

const CoinSchema = new mongoose.Schema({
    ticket: String,
    currency: Number
  }, { collection: 'Coins'});

mongoose.connect('mongodb://mongo_db:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.once('open', function() {
    console.log('connected to mongodb')
  });

module.exports = mongoose.model('Coin', CoinSchema);
