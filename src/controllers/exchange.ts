import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Big from 'big.js';
import ExchangeService, { ExchangeParams } from '../services/exchange';
import { validCurrencyCodes } from '../utils/validations';

class ExchangeController {
    public async exchange(req: Request, res: Response) {
        const { from, to, amount } = req.query;

        if(!from || !to || !amount) {
            return res.status(StatusCodes.BAD_REQUEST).send('One of the expected query parameters was not provided.');
        }

        const originalCurrency = from.toString();
        const finalCurrency = to.toString()

        if(!validCurrencyCodes(originalCurrency, finalCurrency)) {
            return res.status(StatusCodes.BAD_REQUEST).send('One of the currencies provided was not valid. Ensure to be providing an existing currency code in uppercase.');
        }

        let exchangeParams: ExchangeParams;

        try {
            exchangeParams = {
                originalCurrency,
                finalCurrency,
                amount: Big(amount.toString())
            }
        } catch(err) {
            console.error(err);
            return res.status(StatusCodes.BAD_REQUEST).send('One of the query parameters provided was not valid.');
        }

        const exchangeResult = await ExchangeService.exchange(exchangeParams);

        res.json({
            from: exchangeResult.originalCurrency,
            to: exchangeResult.finalCurrency,
            rage: exchangeResult.rate.toFixed(),
            amount: exchangeResult.amount.toFixed(),
            result: exchangeResult.result.toFixed(),
        });
    }
}

export default new ExchangeController();
