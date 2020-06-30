import { FreeCurrencyApiService } from '../../services/free-currency-api.service';
import { injectable, inject } from 'inversify';
import { Currency } from '../../models/currency.model';

@injectable()
export class CurrencyFactory {
    /**
     * Constructor for CurrencyFactory
     */
    constructor(
        @inject(FreeCurrencyApiService) private freeCurrencyApiService: FreeCurrencyApiService
    ) { }

    /**
     * Returns a Currency object with provided parameters
     * @param currencyId Currency Id
     * @param usdRate [OPTIONAL] Value of the currency in US Dollars. If not provided, the value will be queried in a third-party service
     */
    public async Create(currencyId: string, usdRate?: number): Promise<Currency> {
        try {
            const value = usdRate || await this.freeCurrencyApiService.GetUpdatedExchangeRateByCurrencyId(currencyId);
            return new Currency(currencyId, value, new Date());
        } catch (error) {
            throw error;
        }        
        
    }
}