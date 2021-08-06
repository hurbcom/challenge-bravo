import { Request, Response } from "express";
import { container } from "tsyringe";



import { CurrencyService } from "../services/CurrencyService";


class CurrencyController {

    async create(request: Request, response: Response): Promise<Response> {


        const { name, code, valueInUSD } = request.body;

        const currencyService = container.resolve(CurrencyService);

        const currency = await currencyService.create({ name, code, valueInUSD });

        return response.status(201).json(currency);

    }

    async listAll(request: Request, response: Response): Promise<Response> {

        const currencyService = container.resolve(CurrencyService);

        const currencies = await currencyService.listAll();

        return response.json(currencies);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { name, code, valueInUSD } = request.body;

        const { id } = request.params;

        const currencyService = container.resolve(CurrencyService);

        await currencyService.update({ _id: id, name, code, valueInUSD });

        return response.status(204).json({ message: 'Success!' });
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const _id = id;

        const currencyService = container.resolve(CurrencyService);;

        await currencyService.delete(_id);

        return response.json({ message: 'Currency Deleted' });
    }

    async conversionOfCurrency(request: Request, response: Response): Promise<Response> {

        const { from, to, amount } = request.query;

        const currencyService = container.resolve(CurrencyService);

        const convertedAmount = await currencyService.conversionOfCurrency(from as string, to as string, amount as string);

        return response.json(convertedAmount);
    }

    async currentQuote(request: Request, response: Response): Promise<Response> {

        const currencyService = container.resolve(CurrencyService);

        const {BRLInUSD, EURInUSD,BTCInUSD, ETHInUSD} = await currencyService.currentQuote();

      const currentsQuotes =  {
            BRL: BRLInUSD + ' USD',
            BTC: BTCInUSD + ' USD',
            EUR: EURInUSD + ' USD',
            ETH: ETHInUSD + ' USD'
        }



        return response.json({
            message: 'Updated Quotes!',
            currentsQuotes,
            source:'Exchange data provided by HGBrasil and cryptocurrency by Coinbase'
        });
    }
}

export { CurrencyController }