import { Request, Response } from 'express';
import { CurrencyService } from '../services/CurrencyService'
import { CurrencyDTO } from '../models/DTO/CurrencyDTO';
import { CurrencyRepository } from '../repositories/CurrencyRepository';

export class CurrencyController {

    public async Index(request: Request, response: Response) {

        try {
            var currencyService = await new CurrencyService().Index();

            if (Object.keys(currencyService).length === 0) {
                return response.status(400).json({ message: 'Currency not found.' });
            }

            return response.json(currencyService);

        } catch (error) {
            response.status(400).send(error.message);
        };

    };

    public async Show(request: Request, response: Response) {
        try {
            const { codigo } = request.params;
            var currencyService = await new CurrencyService().Show(codigo);
            return response.json(currencyService);

        } catch (error) {
            response.status(400).send(error.message);
        };

    };

    public async Create(request: Request, response: Response) {

        const { codigo, data, cotacao } = request.body;
        var currencyDTO = new CurrencyDTO(codigo, data, cotacao);
        await new CurrencyService().Create(currencyDTO);


        return response.json({ msg: "Criado Com Sucesso!" });
    };

    public async Delete(request: Request, response: Response) {
        const { codigo } = request.params;

        var id = await new CurrencyRepository().Delete(codigo);

        if (id == 0) {
            response.status(400).send({ msg: "Valor não encontrado para deletar" });
        }

        return response.json({ msg: 'Deletado com Sucesso' });
    };
}
