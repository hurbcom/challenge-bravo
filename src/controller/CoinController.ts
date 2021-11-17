import { Coin } from "../entity/Coin";
import { Request, Response } from "express";
import { CoinService } from "../service/CoinService";


export class CoinController {

    public create = async (req: Request, res: Response) => {
        const coin = req.body as Coin

        if (coin != null && coin != undefined) {
            
            const coinService = new CoinService()
            const createdCoin = await coinService.create(coin)
            res.status(201).send(createdCoin)
            console.log(createdCoin)

        } else {
            res.status(500).send("Erro ao criar nova moeda.")
        }
    }
}