import express from 'express';
import ExchageRateController from '../controllers/exchange-rate-controller'
import { body, query, validationResult } from 'express-validator/check';

const router = express.Router();
const exchageRateController = new ExchageRateController();

const availableCurrencyMessage = 'Invalid Currency. Acceptable currencies: USD, BRL, EUR, BTC e ETH';
const availableCurrencyRegex = /USD|BRL|EUR|BTC|ETH/;

router.get('/',
[
  query('from', availableCurrencyMessage).matches(availableCurrencyRegex),
  query('to', availableCurrencyMessage).matches(availableCurrencyRegex),
  query('amount', 'Amount must be a number').isLength({ min: 1 }).isFloat()
],
function(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }

  const convert = {
    from : req.query.from,
    to : req.query.to,
    amount : req.query.amount
  }

  exchageRateController.getCurrencyExchangeRate(convert)
    .then( rates => {
      res.json(rates);
    });
});

module.exports = router;
