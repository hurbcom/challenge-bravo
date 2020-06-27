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

    public getCurrencyById = (req: Request, res: Response): void => {
        const currencyId: string = req.params.currencyId;

        const currency = this.currencyService.getCurrencyById(currencyId);

        if (currency)
            res.json(currency);
        else
            res.sendStatus(404);
    }

    public insertOrUpdateCurrency = (req: Request, res: Response): void => {
        try {
            const currencyDto = req.body;
            const newCurrency: Currency = new Currency(currencyDto.id, currencyDto.usdValue);

            const resultCurrency = this.currencyService.insertOrUpdateCurrency(newCurrency);
            res.json(resultCurrency);    
        } catch (error) {
            debugger;
        }
        
    }
}