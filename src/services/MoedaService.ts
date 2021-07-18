import { IMoeda } from "../models/Moeda";

import { MoedaRepository } from "../repositories/MoedaRepository";



class MoedaService {

    private moedaRepository = new MoedaRepository();

    async create({ name, sigla, valorEmReal }: IMoeda): Promise<IMoeda> {

        const moeda = await this.moedaRepository.create({ name, sigla, valorEmReal });

        return moeda;
    }

    async listAll(): Promise<IMoeda[]> {



        const moedas = await this.moedaRepository.listAll();

        return moedas;
    }

    async update({ _id, name, sigla, valorEmReal }: IMoeda): Promise<IMoeda> {



        const moeda = await this.moedaRepository.update({ _id, name, sigla, valorEmReal });

        return moeda;
    }

    async delete(_id: string): Promise<void> {
        
        await this.moedaRepository.delete(_id);

    }

    async conversionOfMoeda(from: string, to: string, amount: string): Promise<Number>{

        const amountFloat = parseFloat(amount);

        const fromMoeda = await this.moedaRepository.getBySigla(from);

        const fromValueInReal = fromMoeda.valorEmReal;

        const toMoeda = await this.moedaRepository.getBySigla(to);

        const toValueInReal = toMoeda.valorEmReal;

        const convertedAmount = (amountFloat*(fromValueInReal/toValueInReal))

        return convertedAmount;
    }
}

export { MoedaService }