var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render(
    'index',
    {
      title: 'Currency Convertion API',
      endpoints: {
        rates: '/rates',
        friendlyConvertion: '/convert/<currency-from>/<currency-to>/<amount-to-be-converted>',
        qsConvertion: '/convert?from=<currency-from>&to=<currency-to>&amount=<amount-to-be-converted>'
      }
    }
  );
});

module.exports = router;
