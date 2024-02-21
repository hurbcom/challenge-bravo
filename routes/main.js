const express = require('express');
const router = express.Router();

const { query, validationResult } = require('express-validator');

const { Response } = require('../utils/response');
const { ConvertCurrency, ExistsCurrency } = require('../controllers/currency_exchange');
const { formatCurrency } = require('../utils/formatter');

router.get('/', 
    query('from').notEmpty().escape().isLength({ min: 1, max: 10 }).withMessage('Currency code \'from\' must be 3 characters long'),
    query('to').notEmpty().escape().isLength({ min: 1, max: 10 }).withMessage('Currency code \'to\' must be 3 characters long'),
    query('amount').notEmpty().escape().withMessage('Amount must be a number'),
    async (req, res) => {
        const validateQuery = validationResult(req);
        if (!validateQuery.isEmpty()) {
            return Response(res, 400, validateQuery.array());
        }

        const { from, to, amount } = req.query;

        if(!ExistsCurrency(from)) return Response(res, 400, {message: `Currency code 'from' ${from} not found`});
        if(!ExistsCurrency(to)) return Response(res, 400, {message: `Currency code 'from' ${from} not found`});

        const result = {};
        result[from] = formatCurrency(amount, from);
        result[to] = await ConvertCurrency(from, to, amount, to);
        Response(res, 200, result);
    }
);

router.post('/', (req, res) => {
    // Handle the POST request for the root path
    Response(res, 201);
});

router.delete('/', (req, res) => {
    // Handle the DELETE request for the root path
    Response(res, 204);
});

module.exports = router;