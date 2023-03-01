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
}
