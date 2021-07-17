import { IMoeda, Moeda } from "../models/Moeda";


class MoedaRepository {

    async create({ _id, name, sigla, valorEmReal }: IMoeda): Promise<IMoeda> {
        const moeda = await new Moeda({ _id, name, sigla, valorEmReal }).save();
        return moeda;
    }

    async listAll(): Promise<IMoeda[]> {

        const moedas = await Moeda.find();

        return moedas;
    }

    async getById(_id: string): Promise<IMoeda> {

        const moeda = await Moeda.findById({ _id });

        return moeda;
    }

    async getBySigla(sigla: string): Promise<IMoeda> {

        const moeda = await Moeda.findOne({ sigla })

        return moeda;
    }

    async deleteMoeda(_id: string): Promise<void> {
        await Moeda.deleteOne({ _id });
    }

}

export { MoedaRepository }