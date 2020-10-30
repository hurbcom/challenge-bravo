import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Big from 'big.js';
import exchangeService from '../services/exchange';

class ExchangeController {

    private readonly exchangeService;

    constructor() {
        this.exchangeService = exchangeService;
    }

    public exchange : (req: Request, res: Response) => void = async (req, res) => {
        const { from, to, amount } = req.query;

        if(!from || !to || !amount) {
            return res.status(StatusCodes.BAD_REQUEST).send('One of the expected query parameters was not provided.');
        }

        const originalCurrency = from.toString();
        const finalCurrency = to.toString();

        const supportedCurrencies = await this.exchangeService.getSupportedCurrencies();
        if(!supportedCurrencies.includes(originalCurrency) || !supportedCurrencies.includes(finalCurrency)) {
            return res.status(StatusCodes.BAD_REQUEST).send(`One of the currencies provided was not supported.
            The supported currencies are: [${supportedCurrencies}], sensitive case.`);
        }

        let amountBig;

        try {
            amountBig = Big(amount.toString());
        } catch(err) {
            console.error(err);
            return res.status(StatusCodes.BAD_REQUEST).send('The amount provided for the exchange is not valid. Ensure to be providing a monetary value using dot (.) as separator.');
        }

        let exchangeResult;

        try {
            exchangeResult = await this.exchangeService.exchange(originalCurrency, finalCurrency, amountBig);
        } catch (err) {
            console.error(`An error occurred while trying to exchange the values. [${err}].`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('An internal error occurred while trying to exchange the currencies.');
        }

        res.json({
            from: exchangeResult.originalCurrency,
            to: exchangeResult.finalCurrency,
            rate: exchangeResult.rate.toFixed(),
            amount: exchangeResult.amount.toFixed(),
            result: exchangeResult.result.toFixed(),
        });
    }
}

export default new ExchangeController();
