import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import Big from 'big.js';
import ExchangeService from '../services/exchange';

Big.DP = 50;

class ExchangeController {

    constructor(private readonly exchangeService: ExchangeService) {}

    public exchange: (req: Request, res: Response) => void = async (req, res) => {
        const { from, to, amount } = req.query;

        if (!from || !to || !amount) {
            return res.status(StatusCodes.BAD_REQUEST).send('One of the expected query parameters was not provided.');
        }

        const originalCurrency = from.toString();
        const finalCurrency = to.toString();

        try {
            const supportedCurrencies = await this.exchangeService.getSupportedCurrencies();
            if (!supportedCurrencies.includes(originalCurrency) || !supportedCurrencies.includes(finalCurrency)) {
                return res.status(StatusCodes.BAD_REQUEST).send(`One of the currencies provided was not supported.
                The supported currencies are: [${supportedCurrencies}], sensitive case.`);
            }

            let amountBig;

            try {
                amountBig = Big(amount.toString());
            } catch (err) {
                console.error(err);
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .send(
                        'The amount provided for the exchange is not valid. Ensure to be providing a monetary value using dot (.) as separator.'
                    );
            }

            const exchangeResult = await this.exchangeService.exchange(originalCurrency, finalCurrency, amountBig);

            return res.json({
                from: exchangeResult.originalCurrency,
                to: exchangeResult.finalCurrency,
                rate: this.normalizeValues(exchangeResult.rate),
                amount: this.normalizeValues(exchangeResult.amount),
                result: this.normalizeValues(exchangeResult.result),
            });
        } catch (err) {
            console.error(`An error occurred while trying to exchange the values. [${err}].`);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send('An internal error occurred while trying to exchange the currencies.');
        }
    };

    public getSupportedCurrencies: (req: Request, res: Response) => void = async (req, res) => {
        try {
            return res.json(await this.exchangeService.getSupportedCurrencies());
        } catch (err) {
            console.error(`An error occurred while trying to retrieve the supported currencies. [${err}].`);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send('An internal error occurred while trying to retrieve the supported currencies.');
        }
    };

    public addSupportedCurrencies: (req: Request, res: Response) => void = async (req, res) => {
        const { body } = req;

        if (!Array.isArray(body) || !body.length) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send(
                    'The request body should be an array containing the code of the currencies to be added, e.g., ["USD", "EUR", "BRL"].'
                );
        }

        try {
            const availableCurrencies = await this.exchangeService.getAvailableCurrencies();

            for (const currency of body) {
                if (!availableCurrencies.includes(currency)) {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .send(`The currency [${currency}] is not available to be used by the API.`);
                }
            }

            const oldSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            await this.exchangeService.addSupportedCurrencies(body);

            const newSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            console.info(
                `Added support to the following currencies: [${newSupportedCurrencies.filter(
                    (currency) => !oldSupportedCurrencies.includes(currency)
                )}].`
            );

            return res.json(newSupportedCurrencies);
        } catch (err) {
            console.error(`An error occurred while trying to add support to the provided currencies. [${err}].`);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send('An internal error occurred while trying to retrieve the supported currencies.');
        }
    };

    public removeSupportedCurrencies: (req: Request, res: Response) => void = async (req, res) => {
        const { body } = req;

        if (!Array.isArray(body) || !body.length) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .send(
                    'The request body should be an array containing the code of the currencies to be removed, e.g., ["USD", "EUR", "BRL"].'
                );
        }

        try {
            const oldSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            for (const currency of body) {
                if (!oldSupportedCurrencies.includes(currency)) {
                    return res
                        .status(StatusCodes.BAD_REQUEST)
                        .send(`The currency [${currency}] is not supported by the API.`);
                }
            }

            await this.exchangeService.removeSupportedCurrencies(body);

            const newSupportedCurrencies = await this.exchangeService.getSupportedCurrencies();

            console.info(
                `Removed support to the following currencies: [${oldSupportedCurrencies.filter(
                    (currency) => !newSupportedCurrencies.includes(currency)
                )}].`
            );

            return res.json(newSupportedCurrencies);
        } catch (err) {
            console.error(`An error occurred while trying to remove support to the provided currencies. [${err}].`);
            return res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .send('An internal error occurred while trying to retrieve the supported currencies.');
        }
    };

    /** Normalizes the provided value to string.
     *
     * If it has more than two decimal values, ${@link Big.toFixed} will simply be called.
     * If it has zero or only one decimal values, then ${@link Big.toFixed} will be called with value 2.
     */
    private normalizeValues(value: Big): string {
        const valueAsString = value.toFixed();

        if (/(\.[0-9])$/.test(valueAsString) || !/(\.)/.test(valueAsString)) {
            return value.toFixed(2);
        }

        return valueAsString;
    }
}

export default ExchangeController;
