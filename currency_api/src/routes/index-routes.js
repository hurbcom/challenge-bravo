const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {

  res.status(200).send({
    title: 'Currency API',
    version: '1.0.0',
		status: "up"  });
});

module.exports = router;