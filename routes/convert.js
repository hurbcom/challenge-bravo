var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('convert');
});

router.get('/:origin/:originValue/:destiny/:destValue', function(req, res, next) {
  res.send('convert');
});

module.exports = router;
