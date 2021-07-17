import { Request, Response } from "express";
import { Moeda } from "../models/Moeda";


class MoedaController {

    async create(request: Request, response: Response): Promise<Response> {

        const { name, sigla, valorEmReal } = request.body;

        const moeda = await new Moeda({ name, sigla, valorEmReal }).save();

        return response.json(moeda);
    }

    async listAll(request: Request, response: Response): Promise<Response> {

        const moedas = await Moeda.find();

        return response.json(moedas);
    }
}

export { MoedaController }