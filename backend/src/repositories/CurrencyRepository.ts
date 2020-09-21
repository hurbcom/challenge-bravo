import { CurrencyDTO } from '../models/DTO/CurrencyDTO'
import { CurrencyModel } from '../models/CurrencyModel'

import { CurrencyNotFoundError } from "../infra/error/not-found";

import knex from '../infra/connection';


export class CurrencyRepository {

    public async Index(): Promise<CurrencyModel[]> {

        const currency = await knex('currency').select('*');

        if (!currency) {
            throw new CurrencyNotFoundError("Not found");
        };

        const serializedCurrency = currency.map(currency => {
            return new CurrencyModel(currency.id, currency.codigo, currency.data, currency.cotacao);
        });

        return serializedCurrency;
    };

    public async Show(codigo: string): Promise<CurrencyModel> {

        const currency = await knex('currency').where('codigo', codigo).first();

        if (!currency) {
            throw new CurrencyNotFoundError("Not found");
        };

        return new CurrencyModel(currency.id, currency.codigo, currency.data, currency.cotacao);;
    };

    public async Create(newCurrency: CurrencyDTO): Promise<number[]> {
        return await knex('currency').insert(newCurrency).select('codigo');


    };

    public async Delete(codigo: string): Promise<number> {
        return await knex('currency').where('codigo', codigo).delete();
    }
};