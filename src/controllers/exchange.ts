import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Big from 'big.js';
import exchangeService, { ExchangeParams } from '../services/exchange';

class ExchangeController {

    private readonly exchangeService;

    constructor() {
        this.exchangeService = exchangeService;

        this.exchange = this.exchange.bind(this);
    }

    async exchange(req: Request, res: Response) {
        const { from, to, amount } = req.query;

        if(!from || !to || !amount) {
            return res.status(StatusCodes.BAD_REQUEST).send('One of the expected query parameters was not provided.');
        }

        const originalCurrency = from.toString();
        const finalCurrency = to.toString();

        const supportedCurrencies = await this.exchangeService.getSupportedCurrencies();
        if(!supportedCurrencies.includes(originalCurrency) || !supportedCurrencies.includes(finalCurrency)) {
            return res.status(StatusCodes.BAD_REQUEST).send(`One of the currencies provided was not valid.
            Ensure to be providing an existing currency code in uppercase, e.g., ${supportedCurrencies}.`);
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

        let exchangeResult;

        try {
            exchangeResult = await this.exchangeService.exchange(exchangeParams);
        } catch (err) {
            console.error(`An error occurred while trying to exchange the values. [${err}].`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('An internal error occurred while trying to exchange the currencies.');
        }

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
