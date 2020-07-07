import { Request, Response } from 'express';

import ListCurrencyService from '../services/ListCurrencysService';
import RegisterCurrency from '../services/RegisterCurrency';

class CurrencyController {
    async create(request: Request, response: Response): Promise<Response> {
        const { name } = request.body;
        console.log(name);
        const registerCurrency = new RegisterCurrency();

        const newCurrency = await registerCurrency.execute({ name });

        return response.json(newCurrency);
    }

    async update(request: Request, response: Response): Promise<Response> {}

    async index(request: Request, response: Response): Promise<Response> {
        const listCurrencyServices = new ListCurrencyService();

        const currencies = listCurrencyServices.execute();

        return response.json(currencies);
    }
}

export default CurrencyController;
