import { CurrencyService } from '../services/currency.service';
import { Request, Response } from 'express';
import { injectable, inject } from "inversify";

@injectable()
export class CurrencyController {
    private _currencyService: CurrencyService;

    /**
     *
     */
    constructor(
        @inject(CurrencyService) private currencyService: CurrencyService
    ) { 
        this._currencyService = currencyService;
    }

    public getCurrencyById(req: Request, res: Response): void {
        const currencyId: string = req.params.currencyId;

        const currency = this.currencyService.getCurrencyById(currencyId);
        if (this._currencyService) console.log('teste');

        if (currency)
            res.json(currency);
        else
            res.sendStatus(404);
    }
}