import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Big from 'big.js';
import exchangeService from '../services/exchange';
import { STATUS_CODES } from 'http';

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

        try{
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

            const exchangeResult = await this.exchangeService.exchange(originalCurrency, finalCurrency, amountBig);

            return res.json({
                from: exchangeResult.originalCurrency,
                to: exchangeResult.finalCurrency,
                rate: exchangeResult.rate.toFixed(),
                amount: exchangeResult.amount.toFixed(),
                result: exchangeResult.result.toFixed(),
            });
        } catch (err) {
            console.error(`An error occurred while trying to exchange the values. [${err}].`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('An internal error occurred while trying to exchange the currencies.');
        }
    }

    public getSupportedCurrencies : (req: Request, res: Response) => void = async (req, res) => {
        try{
            return res.json(await this.exchangeService.getSupportedCurrencies());
        } catch(err) {
            console.error(`An error occurred while trying to retrieve the supported currencies. [${err}].`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('An internal error occurred while trying to retrieve the supported currencies.');
        }
    }

    public addSupportedCurrencies : (req: Request, res: Response) => void = async (req, res) => {
        const { body } = req;

        if(!Array.isArray(body) || !body.length) {
            return res.status(StatusCodes.BAD_REQUEST).send('The request body should be an array containing the code of the currencies to be added, e.g., ["USD", "EUR", "BRL"].');
        }

        try{
            const oldSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            await this.exchangeService.addSupportedCurrencies(body);

            const newSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            console.info(`Added support to the following currencies: [${newSupportedCurrencies.filter((currency) => !oldSupportedCurrencies.includes(currency))}].`);

            return res.json(newSupportedCurrencies);
        } catch(err) {
            console.error(`An error occurred while trying to add support to the provided currencies. [${err}].`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('An internal error occurred while trying to retrieve the supported currencies.');
        }
    }

    public removeSupportedCurrencies : (req: Request, res: Response) => void = async (req, res) => {
        const { body } = req;

        if(!Array.isArray(body) || !body.length) {
            return res.status(StatusCodes.BAD_REQUEST).send('The request body should be an array containing the code of the currencies to be removed, e.g., ["USD", "EUR", "BRL"].');
        }

        try{
            const oldSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            await this.exchangeService.removeSupportedCurrencies(body);

            const newSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            console.info(`Removed support to the following currencies: [${oldSupportedCurrencies.filter((currency) => !newSupportedCurrencies.includes(currency))}].`);

            return res.json(oldSupportedCurrencies);
        } catch(err) {
            console.error(`An error occurred while trying to remove support to the provided currencies. [${err}].`);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('An internal error occurred while trying to retrieve the supported currencies.');
        }
    }
}

export default new ExchangeController();
