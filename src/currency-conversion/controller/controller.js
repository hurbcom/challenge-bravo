const express = require('express');
const rules = require('../rules');

const router = express.Router();


const conversion = (_req, res) => {
  res.json({
    conversion: true,
  });
};

router.get('/', [...rules], conversion);


module.exports = router;
