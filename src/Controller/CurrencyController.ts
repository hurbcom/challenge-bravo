import { type Request, type Response } from "express";
import { inject, injectable } from "inversify";
import { ICurrencyService } from "../Services/types/CurrencyService.interface";

@injectable()
export class CurrencyController {
    constructor(
        @inject("CurrencyService")
        private readonly currencyService: ICurrencyService
    ) {}

    async getConversion(
        req: Request<
            any,
            any,
            any,
            { from: string; to: string; amount: string }
        >,
        res: Response
    ): Promise<void> {
        const { from, to, amount } = req.query;
        if (from != null && to != null && amount != null) {
            const data = await this.currencyService.getConversion(
                from,
                to,
                Number(amount)
            );
            res.json(data);
        } else {
            res.status(400).json({
                message: 'queries "from", "to" and "amount" is required',
            });
        }
    }

    async createCurrency(req: Request, res: Response): Promise<void> {
        await this.currencyService.createCurrency(req.body);
        res.status(201).send();
    }

    async deleteCurrency(req: Request, res: Response): Promise<void> {
        await this.currencyService.deleteCurrency(req.params.currencyId);
        res.status(204).send();
    }
}
