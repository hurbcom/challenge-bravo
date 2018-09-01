var express = require('express');
var request = require('request');
var router = express.Router();
var app = express();


/* GET home page. */
router.get('/', function(req, res, next) {
  request({
    uri: 'http://www.giantbomb.com/api/search',
    qs: {
      api_key: '123456',
      query: 'World of Warcraft: Legion'
    }
  }).pipe(res);
});

router.get('/convert', function(req, res, next) {
  var amount = req.query.amount;
  var to_coin = req.query.to;
  var from_coin = req.query.from;
  //http://apilayer.net/api/live?access_key=190554a418c31328521347ddc63c3a13&currencies=EUR,GBP,CAD,PLN&source=USD&format=1
  //https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BTC,USD,EUR,ETH
  var url_root = 'https://min-api.cryptocompare.com/data/price?';
  var url = url_root + 'fsym=' + to_coin + '&tsyms='+ from_coin;
  var total_amount = 56191910;
  var converted_value = 0; 

  //request do site currency layer
  // passando o access key, as moedas a serem convertidas e a moeda lastro

  request({
    uri: url,
  }).pipe(res);

});

module.exports = router;