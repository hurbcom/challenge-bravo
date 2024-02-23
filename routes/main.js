const express = require('express');
const router = express.Router();

const { query, body, validationResult } = require('express-validator');

const { Response } = require('../utils/response');
const { 
    ConvertCurrency, ExistsCurrency, NewCurrency, DeleteCurrency
} = require('../controllers/currency_exchange');
const { formatCurrency } = require('../utils/formatter');

router.get('/', 
    query('from').notEmpty().escape().isLength({ min: 1, max: 10 }).withMessage('Currency code \'from\' must be 1 characters long'),
    query('to').notEmpty().escape().isLength({ min: 1, max: 10 }).withMessage('Currency code \'to\' must be 1 characters long'),
    query('amount').notEmpty().escape().withMessage('Amount must be a number'),
    async (req, res) => {
        try {
            const validateQuery = validationResult(req);
            if (!validateQuery.isEmpty()) {
                return Response(res, 400, validateQuery.array());
            }

            const { from, to, amount } = req.query;

            if(!ExistsCurrency(from.toUpperCase())) return Response(res, 400, {message: `Currency code 'from' ${from} not found`});
            if(!ExistsCurrency(to.toUpperCase())) return Response(res, 400, {message: `Currency code 'from' ${from} not found`});

            const result = {};
            result[from] = formatCurrency(amount, from);
        
            result[to] = await ConvertCurrency(from, to, amount, to);
            Response(res, 200, result);
        } catch (error) {
            console.error('routes/main.js ~ get ~ ERROR: ', error);
            Response(res, 500, {message: error.message});
        }
    }
);

router.post('/', 
    body('currency').notEmpty().trim().escape().isLength({ min: 1, max: 10 }).withMessage('Currency code must be 3 characters long'),
    body('ballast_usd').notEmpty().trim().escape().isLength({ min: 1 }).isFloat().withMessage('Ballast USD must be a number'),
    async (req, res) => {
        try {
            const validateBody = validationResult(req);
            if (!validateBody.isEmpty()) {
                return Response(res, 400, validateBody.array());
            }
            
            const { currency, ballast_usd } = req.body;
            const result = await NewCurrency(currency, ballast_usd);

            Response(res, result.status, {message: result.message});
        } catch (error) {
            console.error('routes/main.js ~ post ~ ERROR: ', error);
            return Response(res, 500, {message: error.message});
        }
        
    }
);

router.delete('/', 
    query('currency').notEmpty().escape().isLength({ min: 1, max: 10 }).withMessage('Currency code \'from\' must be 1 characters long'),
    async (req, res) => {
        try {
            const validateBody = validationResult(req);
            if (!validateBody.isEmpty()) {
                return Response(res, 400, validateBody.array());
            }

            const { currency } = req.query;

            if(!ExistsCurrency(currency.toUpperCase())) return Response(res, 400, {message: `Currency code 'from' ${from} not found`});

            await DeleteCurrency(currency.toUpperCase());

            Response(res, 200, {message: 'Currency deleted successfully'});
        } catch (error) {
            console.error('routes/main.js ~ delete ~ ERROR: ', error);
            return Response(res, 500, {message: error.message});
        }
    
    }
);

module.exports = router;