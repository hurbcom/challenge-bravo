import { Request, Response } from "express";
import { Currency, currencyModel, CurrencyType } from "../models/CurrencyModel";
import { updateRates } from "../services/updateRates";

class CurrencyController {

    public async init() {
        let coins: string | undefined = process.env.COINS;
        let coinsArr: string[] = coins ? coins.split(',') : [];
        let memoryCoins: Currency[] = await currencyModel.getCurrencies();

        if (coinsArr.length > 0) {
            coinsArr.forEach(async (coin) => {
                let idx: number = memoryCoins.findIndex((c) => c.symbol == coin);
                if (idx === -1) {
                    let body: Currency = {
                        symbol: coin,
                        type: CurrencyType.main,
                        rate: '1'
                    }
                    await currencyModel.addCurrency(coin, body);
                }
            });
        }

        return await updateRates.startCron();
    }

    public async add(req: Request, res: Response) {
        let body = req.body;
        let coins: Currency[] = await currencyModel.getCurrencies();
        let idx = coins.findIndex((i) => i.symbol == req.body.asset);
        if (idx >= 0 && coins[idx].type == 'main')
            return res.status(404).json({
                response: `${req.body.asset} can't be altered!`
            });
        let coin: Currency = {
            ...body
        }
        try {
            coin.rate = await updateRates.getTax(coin);
        } catch(err: any) {
            return res.status(400).json(err?.message);
        }
        
        await currencyModel.addCurrency(coin.symbol, coin);
        return res.status(200).json({
            message: `Asset ${coin.symbol} added with success!`
        });
    }

    public async remove(req: Request, res: Response) {
        let coins: Currency[] = await currencyModel.getCurrencies();
        let idx = coins.findIndex((i) => i.symbol == req.params.asset);
        if (idx < 0)
            return res.status(404).json({
                response: `${req.params.asset} not found`
            });
        if (coins[idx].type == 'main')
            return res.status(400).json({
                response: `Main coin ${req.params.asset} can't be removed`
            });
        await currencyModel.deleteCurrency(req.params.asset);
        return res.status(200).json({
            message: `Asset ${req.params.asset} removed with success!`
        });
    }

}

export const currencyController = new CurrencyController();