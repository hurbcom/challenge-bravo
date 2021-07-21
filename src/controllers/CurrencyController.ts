import { Request, Response } from "express";

import { CurrencyService } from "../services/CurrencyService";


class CurrencyController {

    async create(request: Request, response: Response): Promise<Response> {

        const { name, code, valueInUSD } = request.body;

        const currencyService = new CurrencyService();

        const currency = await currencyService.create({ name, code, valueInUSD });

        return response.status(201).json(currency);
    }

    async listAll(request: Request, response: Response): Promise<Response> {

        const currencyService = new CurrencyService();

        const currencies = await currencyService.listAll();

        return response.json(currencies);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { name, code, valueInUSD } = request.body;

        const { id } = request.params;

        const _id = id;

        const currencyService = new CurrencyService();

        await currencyService.update({ _id, name, code, valueInUSD });

        return response.status(204).json({ message: 'Success!' });
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const _id = id;

        const currencyService = new CurrencyService();

        await currencyService.delete(_id);

        return response.json({ message: 'Currency Excluída' });
    }

    async conversionOfCurrency(request: Request, response: Response): Promise<Response> {

        const { from, to, amount } = request.query;

        const currencyService = new CurrencyService();

        const convertedAmount = await currencyService.conversionOfCurrency(from as string, to as string, amount as string);

        return response.json(convertedAmount);
    }
}

export { CurrencyController }