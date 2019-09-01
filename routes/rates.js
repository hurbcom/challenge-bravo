var express = require('express');
var cacheProvider = require('../cache-provider');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send(cacheProvider.instance().get('rates'));
});

module.exports = router;
