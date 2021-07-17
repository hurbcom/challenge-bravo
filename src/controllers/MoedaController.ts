import { Request, Response } from "express";

import { MoedaService } from "../services/MoedaService";


class MoedaController {

    async create(request: Request, response: Response): Promise<Response> {

        const { name, sigla, valorEmReal } = request.body;

        const moedaService = new MoedaService();

        const moeda = await moedaService.create({ name, sigla, valorEmReal });

        return response.json(moeda);
    }

    async listAll(request: Request, response: Response): Promise<Response> {

        const moedaService = new MoedaService();

        const moedas = await moedaService.listAll();

        return response.json(moedas);
    }

    async update(request: Request, response: Response): Promise<Response> {
        const { name, sigla, valorEmReal } = request.body;

        const { id } = request.params;

        const _id = id;

        const moedaService = new MoedaService();

        const moeda = await moedaService.update({ _id, name, sigla, valorEmReal });

        return response.json(moeda);
    }

    async delete(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;

        const _id = id;

        const moedaService = new MoedaService();

        await moedaService.delete(_id);

        return response.json({ message: 'Moeda Excluída' });
    }
}

export { MoedaController }