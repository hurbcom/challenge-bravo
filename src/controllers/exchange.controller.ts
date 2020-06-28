import { injectable, inject } from "inversify";
import { Request, Response } from 'express';
import { ExchangeService } from "../services/exchange.service";

@injectable()
export class ExchangeController {
    /**
     *
     */
    constructor(
        @inject(ExchangeService) private exchangeService: ExchangeService
    ) { }

    public convertCurrency = async (req: Request, res: Response): Promise<void> => {

        if (!req.query['from'] || !req.query['to'] || !req.query['ammount'])
        {
            res.sendStatus(400);
            return;
        }
        
        const from: string = req.query['from'].toString();
        const to: string = req.query['to'].toString();
        const ammount: number = parseFloat(req.query['ammount'].toString());
        const convertedValue = await this.exchangeService.convertCurrency(from, to, ammount);

        res.json(convertedValue);
    }
}