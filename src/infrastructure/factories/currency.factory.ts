import { FreeCurrencyApiService } from '../../services/free-currency-api.service';
import { injectable, inject } from 'inversify';
import { Currency } from '../../models/currency.model';

@injectable()
export class CurrencyFactory {
    /**
     *
     */
    constructor(
        @inject(FreeCurrencyApiService) private freeCurrencyApiService: FreeCurrencyApiService
    ) { }

    public async Create(currencyId: string, usdRate?: number): Promise<Currency> {
        try {
            const value = usdRate || await this.freeCurrencyApiService.GetUpdatedExchangeRateByCurrencyId(currencyId);
            return new Currency(currencyId, value, new Date());
        } catch (error) {
            throw error;
        }        
        
    }
}