import { Request, Response } from "express";
import { Currency, currencyModel } from "../models/CurrencyModel";
import BigNumber from "bignumber.js";

class ConversionController {
    public async conversion(req: Request, res: Response) {
        let query: any = req.query;

        let fromCoin: Currency = await currencyModel.getCurrency(query.from);
        if (!fromCoin)
            return res.status(404).json({
                response: `${query.from} not found`
            });
        let toCoin: Currency = await currencyModel.getCurrency(query.to);
        if (!toCoin)
            return res.status(404).json({
                response: `${query.to} not found`
            });
        let amount = req.query.amount ? Number(req.query.amount) : 1;
        let value = new BigNumber(fromCoin.rate).dividedBy(toCoin.rate).multipliedBy(amount).toFixed(Number(query.decimalPlaces) || 8);

        return res.status(200).json({
            from: query.from,
            amount,
            to: query.to,
            value
        });
    }
}

export const conversionController = new ConversionController();