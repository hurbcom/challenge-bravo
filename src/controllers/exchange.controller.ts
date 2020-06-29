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

        try {
            const from: string = req.query['from'].toString();
            const to: string = req.query['to'].toString();
            const ammount: number = parseFloat(req.query['ammount'].toString());
            const convertedValue = await this.exchangeService.convertCurrency(from, to, ammount);
    
            res.json(convertedValue);   
        } catch (error) {
            if (error.message === 'One or more currencies were not found') {
                res.status(404).send(error.message);
            } else {
                res.sendStatus(500);
            }
        }
    }
}