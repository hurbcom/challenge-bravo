import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../models/currency.model';
import { injectable, inject } from 'inversify';
import { FreeCurrencyApiService } from './free-currency-api.service';

@injectable()
export class CurrencyService {
    /**
     *
     */
    constructor(
        @inject(CurrencyRepository) private currencyRepository: CurrencyRepository,
        @inject(FreeCurrencyApiService) private freeCurrencyApiService: FreeCurrencyApiService
    ) { }

    public async getCurrencyById(id: string): Promise<Currency | null> {
        if (!id) {
            throw new Error('Currency id required');
        }

        const currency = await this.currencyRepository.getCurrencyById(id);

        //TODO: Verificar data da última cotação e atualizar se necessário
        await this.freeCurrencyApiService.GetUpdatedExchangeRateByCurrencyId(id);

        return currency;
    }

    public async getAllCurrencies(): Promise<Currency[]> {
        return await this.currencyRepository.getAllCurrencies();
    }

    public async insertOrUpdateCurrency(newCurrency: Currency): Promise<Currency> {

        if (!newCurrency || !newCurrency.id || !newCurrency.usdRate) {
            throw new Error('Currency object invalid');
        }

        return await this.currencyRepository.insertOrUpdateCurrency(newCurrency);
    }
}