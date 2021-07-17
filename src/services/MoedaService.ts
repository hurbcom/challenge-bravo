import { IMoeda } from "../models/Moeda";

import { Moeda } from "../models/Moeda";



class MoedaService {
    async create({ name, sigla, valorEmReal }: IMoeda): Promise<IMoeda> {
        const moeda = await new Moeda({ name, sigla, valorEmReal }).save();
        return moeda;
    }

    async listAll(): Promise<IMoeda[]> {
        
        const moedas = await Moeda.find();

        return moedas;
    }
}

export { MoedaService }