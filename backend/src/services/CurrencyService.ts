
import { CurrencyModel } from '../models/CurrencyModel';
import { CurrencyDTO } from '../models/DTO/CurrencyDTO';
import { CurrencyRepository } from '../repositories/CurrencyRepository';

export class CurrencyService {

    public async Index(): Promise<CurrencyModel[]> {
        var currencyRepository = await new CurrencyRepository().Index();
        return currencyRepository;
    }

    public async Show(codigo: string): Promise<CurrencyModel> {

        var currencyRepository = await new CurrencyRepository().Show(codigo);

        return currencyRepository;
    }

    public async Create(newCurrency: CurrencyDTO): Promise<number[]> {
       return  await new CurrencyRepository().Create(newCurrency);
    }

    public async Delete(codigo: string): Promise<number> {
       return await new CurrencyRepository().Delete(codigo);
    }
}
