const express = require('express');
const router = express.Router();

const { query, body, validationResult } = require('express-validator');

const { Response } = require('../utils/response');
const { 
    ConvertCurrency, GetCurrency, NewCurrency, DeleteCurrency
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

            let from = req.query.from;
            let to = req.query.to;
            const amount = req.query.amount;

            let f = GetCurrency(from.toUpperCase());
            let t = GetCurrency(to.toUpperCase());

            from = await f;
            to = await t;

            if(!from) return Response(res, 400, {message: `Currency code 'from' ${req.query.from} not found`});
            if(!to) return Response(res, 400, {message: `Currency code 'to' ${req.query.to} not found`});
            
            from = JSON.parse(from);
            to = JSON.parse(to);

            const converted = await ConvertCurrency(from, to, amount);

            const result = {};
            result[from.currency] = converted.from;
            result[to.currency] = converted.to;

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
    body('crypto').optional().trim().escape().isLength({ min: 1 }).isBoolean().withMessage('Crypto must be a boolean'),
    async (req, res) => {
        try {
            const validateBody = validationResult(req);
            if (!validateBody.isEmpty()) {
                return Response(res, 400, validateBody.array());
            }
            
            const currency = req.body.currency;
            const ballast_usd = req.body.ballast_usd;
            let crypto = req.body.crypto;
            crypto = typeof crypto === 'undefined' ? false : crypto === 'true'; 

            const result = await NewCurrency(
                currency, 
                ballast_usd, 
                typeof crypto === 'undefined' ? false : crypto
            );

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