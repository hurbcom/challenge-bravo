
import { Request, Response } from 'express';
import { ExchangeService } from '../services/ExchangeService';
import { ExchangeModel } from '../models/ExchangeModel'
import { CurrencyApiService } from '../services/CurrencyApiService';


export class ExchangeController {

    async Converter(request: Request, response: Response) {
        try {
            const { from, to, amount } = request.query;

            var exchangeModel = new ExchangeModel(String(from), String(to), Number(amount));

            const convertedValue = await new ExchangeService().convertCurrency(exchangeModel);
            console.log(convertedValue);
            return response.json({ cotacao: convertedValue });

        } catch (error) {
            response.status(400).send(error.message);
        };
    };

    async Latest(request: Request, response: Response) {

        new CurrencyApiService().UpdateCurrency();

        return response.json({ importacao: 'Importação feita com sucesso!' });
    }
}
