const express = require('express');
const router = express.Router();
const { Response } = require('../utils/response');

const { ConvertCurrency } = require('../services/currency_exchange');

router.get('/', (req, res) => {
    const { from, to, amount } = req.query;
    const result = {};
    result[from] = amount;
    result[to] = ConvertCurrency(from, to, amount);
    Response(res, 200, result);
});

router.post('/', (req, res) => {
    // Handle the POST request for the root path
    Response(res, 201);
});

router.delete('/', (req, res) => {
    // Handle the DELETE request for the root path
    Response(res, 204);
});

module.exports = router;