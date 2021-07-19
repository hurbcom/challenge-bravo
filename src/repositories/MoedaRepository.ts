import { IMoeda, Moeda } from "../models/Moeda";


class MoedaRepository {

    async create({ name, sigla, valueInReal }: IMoeda): Promise<IMoeda> {
        const moeda = await new Moeda({ name, sigla, valueInReal }).save();
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

    async delete(_id: string): Promise<void> {
        await Moeda.deleteOne({ _id });
    }

    async update({ _id, name, sigla, valueInReal }: IMoeda): Promise<IMoeda> {

        const moeda = await Moeda.findByIdAndUpdate({_id},{name, sigla, valueInReal})

        return moeda;
    }

}

export { MoedaRepository }