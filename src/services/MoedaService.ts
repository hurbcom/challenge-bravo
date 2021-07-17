import { IMoeda } from "../models/Moeda";

import { Moeda } from "../models/Moeda";
import { MoedaRepository } from "../repositories/MoedaRepository";



class MoedaService {

    async create({ name, sigla, valorEmReal }: IMoeda): Promise<IMoeda> {

        const moedaRepository = new MoedaRepository();

        const moeda = await moedaRepository.create({ name, sigla, valorEmReal });
        return moeda;
    }

    async listAll(): Promise<IMoeda[]> {

        const moedaRepository = new MoedaRepository();

        const moedas = await moedaRepository.listAll();

        return moedas;
    }

    async update({ _id, name, sigla, valorEmReal }: IMoeda): Promise<IMoeda> {

        const moedaRepository = new MoedaRepository();

        const moeda = await moedaRepository.update({ _id, name, sigla, valorEmReal });

        return moeda;
    }

    async delete(_id: string): Promise<void> {

        const moedaRepository = new MoedaRepository();

        await moedaRepository.delete(_id);


    }
}

export { MoedaService }