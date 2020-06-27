import { CurrencyService } from "../services/currency.service";
import { Request, Response } from 'express';

export class CurrencyController {
    /**
     *
     */
    constructor(private currencyService: CurrencyService) {}

    public getCurrencyById(req: Request, res: Response) {
        const currencyId: string = req.params.currencyId;

        const currency = this.currencyService.getCurrencyById(currencyId);

        if (currency)
            res.json(currency);
        else
            res.sendStatus(404);
    }
}