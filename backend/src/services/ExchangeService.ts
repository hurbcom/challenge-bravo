import knex from '../infra/connection';
import { ExchangeModel } from '../models/ExchangeModel';
import { CurrencyNotFoundError } from "../infra/error/not-found";

export class ExchangeService {

    public async convertCurrency(currencyModel: ExchangeModel): Promise<number> {



        const fromCurrency = await knex('currency').where('codigo', currencyModel.From?.toString()).first();

        if (!fromCurrency) {
            throw new CurrencyNotFoundError("Moeda -From- Não encontrada");
        };

        const toCurrency = await knex('currency').where('codigo', currencyModel.To?.toString()).first();

        if (!toCurrency) {
            throw new CurrencyNotFoundError("Moeda -To- Não encontrada");
        };


        let convertedAmount: number;

        if (fromCurrency.codigo == 'USD')
            convertedAmount = currencyModel.Amount * toCurrency.cotacao;
        else if (toCurrency.codigo == 'USD')
            convertedAmount = currencyModel.Amount / fromCurrency.cotacao;
        else
            convertedAmount = (currencyModel.Amount * toCurrency.cotacao) / fromCurrency.cotacao;

        return convertedAmount;
    }
}
