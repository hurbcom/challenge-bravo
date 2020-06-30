import { CurrencyService } from '../services/currency.service';
import { Request, Response } from 'express';
import { injectable, inject } from "inversify";
import { Currency } from '../models/currency.model';

@injectable()
export class CurrencyController {
    /**
     *
     */
    constructor(
        @inject(CurrencyService) private currencyService: CurrencyService
    ) { }

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

    public insertOrUpdateCurrency = async (req: Request, res: Response): Promise<void> => {
        try {
            const currencyDto = req.body;
            const newCurrency: Currency = new Currency(currencyDto.id, currencyDto.usdRate);

            const resultCurrency = await this.currencyService.insertOrUpdateCurrency(newCurrency);
            res.status(201).json(resultCurrency);    
        } catch (error) {
            if (error.message == 'Currency object invalid')
            {
                res.status(400).send(error.message);
                return;
            }
                
            res.sendStatus(500);
        }   
    }

    public getAllCurrencies = async (_: Request, res: Response): Promise<void> => {
        try {
            const result = await this.currencyService.getAllCurrencies();
        res.status(200).json(result);
        } catch (error) {
            res.sendStatus(500);
        }
        
    }
}