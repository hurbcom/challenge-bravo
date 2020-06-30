import { injectable, inject } from "inversify";
import { Request, Response } from 'express';
import { ExchangeService } from "../services/exchange.service";

@injectable()
export class ExchangeController {
    /**
     * Constructor for Exchange Controller
     */
    constructor(
        @inject(ExchangeService) private exchangeService: ExchangeService
    ) { }

    /**
     * Returns the applied exchange rate between currencies
     * @param req Request object from Express
     * @param res Response object from Express
     */
    public convertCurrency = async (req: Request, res: Response): Promise<void> => {

        // Check if the parameters are correct
        if (!req.query['from'] || !req.query['to'] || !req.query['ammount'])
        {
            res.sendStatus(400);
            return;
        }

        try {
            // Parses each parameter
            const from: string = req.query['from'].toString();
            const to: string = req.query['to'].toString();
            const ammount: number = parseFloat(req.query['ammount'].toString());

            // Calls the service that handles the conversion
            const convertedValue = await this.exchangeService.convertCurrency(from, to, ammount);
    
            res.json(convertedValue);   
        } catch (error) {
            // Error check
            if (error.message === 'One or more currencies were not found') {
                res.status(404).send(error.message);
            } else {
                res.sendStatus(500);
            }
        }
    }
}