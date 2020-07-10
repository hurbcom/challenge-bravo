import { Request, Response } from 'express';

import ListCurrencyService from '../services/ListCurrencysService';
import RegisterCurrency from '../services/RegisterCurrency';
import ConvertCurrenciesService from '../services/ConvertCurrenciesService';

class CurrencyController {
    async create(request: Request, response: Response): Promise<Response> {
        const { name } = request.body;

        const registerCurrency = new RegisterCurrency();

        const newCurrency = await registerCurrency.execute({ name });

        return response.status(200).json(newCurrency);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { from, to, amount } = request.query;

        const convertCurrency = new ConvertCurrenciesService();

        const currencyConverted = await convertCurrency.execute({
            from: String(from),
            to: String(to),
            amount: Number(amount),
        });

        return response.status(200).json(currencyConverted);
    }

    async index(request: Request, response: Response): Promise<Response> {
        const listCurrencyServices = new ListCurrencyService();

        const currencies = await listCurrencyServices.execute();

        return response.status(200).json(currencies);
    }
}

export default CurrencyController;
