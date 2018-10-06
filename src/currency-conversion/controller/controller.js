const express = require('express');
const { split } = require('ramda');
const rules = require('../rules');
const { cryptoCompare } = require('../../core/integrations');

const router = express.Router();


const conversion = async (req, res) => {
  const { from, to } = req.query;
  try {
    const result = await cryptoCompare({ from, to: split(',', to) });
    res.json({
      result,
    });
  } catch (err) {
    console.log(err);
  }
};


router.get('/', [...rules], conversion);

module.exports = router;
