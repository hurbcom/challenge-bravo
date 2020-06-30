import { CurrencyService } from '../services/currency.service';
import { Request, Response } from 'express';
import { injectable, inject } from "inversify";
import { Currency } from '../models/currency.model';

@injectable()
export class CurrencyController {
    /**
     * Constructor for CurrencyController
     */
    constructor(
        @inject(CurrencyService) private currencyService: CurrencyService
    ) { }

    /**
     * Gets a currency object by id on the route
     * @param req Request object from Express
     * @param res Response object from Express
     */
    public getCurrencyById = async (req: Request, res: Response): Promise<void> => {
        try {
            const currencyId: string = req.params.currencyId;
            const currency = await this.currencyService.getCurrencyById(currencyId);

            if (currency)
                res.json(currency);
            else
                res.status(404).send('Currency not found');
        } catch (error) {
            res.sendStatus(500);
        }
    }

    /**
     * Inserts or updates a currency
     * @param req Request object from Express
     * @param res Response object from Express
     */
    public insertOrUpdateCurrency = async (req: Request, res: Response): Promise<void> => {
        try {
            const currencyDto = req.body;
            const newCurrency: Currency = new Currency(currencyDto.id, currencyDto.usdRate);

            const resultCurrency = await this.currencyService.insertOrUpdateCurrency(newCurrency);
            res.status(201).json(resultCurrency);
        } catch (error) {
            // Check error type
            if (error.message == 'Currency object invalid') {
                res.status(400).send(error.message);
                return;
            }

            res.sendStatus(500);
        }
    }

    /**
     * Returns all currencies that exists in the system
     * @param _ Discarded parameter
     * @param res Response object from Express
     */
    public getAllCurrencies = async (_: Request, res: Response): Promise<void> => {
        try {
            const result = await this.currencyService.getAllCurrencies();
            res.status(200).json(result);
        } catch (error) {
            res.sendStatus(500);
        }
    }

    /**
     * Deletes a currency from the system
     * @param req Request object from Express
     * @param res Response object from Express
     */
    public deleteCurrencyById = async (req: Request, res: Response): Promise<void> => {
        try {
            const currencyId = req.params.currencyId;

            // Checks if exists any currency with the provided id. If it doesn´t, return a not found status code.
            if ((await this.currencyService.getCurrencyById(currencyId))?.isValid()) {
                await this.currencyService.deleteCurrencyById(currencyId);
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        } catch (error) {
            res.sendStatus(500);
        }
    }
}