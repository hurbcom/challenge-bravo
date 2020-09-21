import axios from 'axios';
import { environment } from '../../environment';
import { CurrencyDTO } from '../models/DTO/CurrencyDTO'
import { CurrencyRepository } from '../repositories/CurrencyRepository'


export class CurrencyApiService {

    public async UpdateCurrency() {

        const response = await axios.get(`${environment.externalServices.currencyApiUrl}?base=${environment.externalServices.baseCurrency}`);

        if (response.status == 200) {

            Object.getOwnPropertyNames(response.data.rates).forEach(async function (val, idx, array) {

                var data = new Date();

                var currency = new CurrencyDTO();
                currency.codigo = val;
                currency.data = `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;
                currency.cotacao = response.data.rates[val];

                new CurrencyRepository().Create(currency);

            });

        }
        else
            throw new Error('Api Down');
    }
}


