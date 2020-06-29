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
        const currencyId: string = req.params.currencyId;
        const currency = await this.currencyService.getCurrencyById(currencyId);

        if (currency)
            res.json(currency);
        else
            res.status(404).send('Currency not found');
    }

    public insertOrUpdateCurrency = async (req: Request, res: Response): Promise<void> => {
        try {
            const currencyDto = req.body;
            const newCurrency: Currency = new Currency(currencyDto.id, currencyDto.usdValue);

            const resultCurrency = await this.currencyService.insertOrUpdateCurrency(newCurrency);
            res.status(201).json(resultCurrency);    
        } catch (error) {
            debugger;
        }
        
    }
}