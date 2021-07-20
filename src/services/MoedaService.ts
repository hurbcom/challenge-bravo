import { AppError } from "../AppError";
import { IMoeda } from "../models/Moeda";

import { MoedaRepository } from "../repositories/MoedaRepository";



class MoedaService {

    private moedaRepository = new MoedaRepository();

    async create({ name, sigla, valueInReal }: IMoeda): Promise<IMoeda> {

        const moedaAlreadyExists = await this.moedaRepository.getBySigla(sigla);

        if(moedaAlreadyExists){
            throw new AppError("Moeda Already Exists");
        }

        const moeda = await this.moedaRepository.create({ name, sigla, valueInReal });

        return moeda;
    }

    async listAll(): Promise<IMoeda[]> {

        const moedas = await this.moedaRepository.listAll();

        return moedas;
    }

    async update({ _id, name, sigla, valueInReal }: IMoeda): Promise<IMoeda> {


        const moeda = await this.moedaRepository.update({ _id, name, sigla, valueInReal });

        return moeda;
    }

    async delete(_id: string): Promise<void> {

        await this.moedaRepository.delete(_id);

    }

    async conversionOfMoeda(from: string, to: string, amount: string): Promise<Number>{

        const amountFloat = parseFloat(amount);

        if(!amountFloat){

            throw new AppError("Invalid Amount!");
        }

        const fromMoeda = await this.moedaRepository.getBySigla(from.toUpperCase());

        const toMoeda = await this.moedaRepository.getBySigla(to.toUpperCase());

        if(!fromMoeda || !toMoeda){

            throw new AppError("Invalid Coin!");
        }

        const fromValueInReal = fromMoeda.valueInReal;

        const toValueInReal = toMoeda.valueInReal;

        const convertedAmount =parseFloat((amountFloat * (fromValueInReal/toValueInReal)).toFixed(4))

        return convertedAmount;
    }
}

export { MoedaService }