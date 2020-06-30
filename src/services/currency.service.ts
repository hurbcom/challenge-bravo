import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../models/currency.model';
import { injectable, inject } from 'inversify';
// import { FreeCurrencyApiService } from './free-currency-api.service';

@injectable()
export class CurrencyService {
    /**
     * Currency Service constructor
     */
    constructor(
        @inject(CurrencyRepository) private currencyRepository: CurrencyRepository,
        // @inject(FreeCurrencyApiService) private freeCurrencyApiService: FreeCurrencyApiService
    ) { }

    /**
     * Returns the Currency object that matches with the id
     * @param id Currency id
     */
    public async getCurrencyById(id: string): Promise<Currency | null> {
        // Check if an id was provided
        if (!id) {
            throw new Error('Currency id required');
        }

        const currency = await this.currencyRepository.getCurrencyById(id);

        return currency;
    }

    /**
     * Returns all currencies that exists in the system
     */
    public async getAllCurrencies(): Promise<Currency[]> {
        return await this.currencyRepository.getAllCurrencies();
    }

    /**
     * Inserts or updates a currency
     * @param newCurrency Currency object
     */
    public async insertOrUpdateCurrency(newCurrency: Currency): Promise<Currency> {
        // Check if a valid object was provided
        if (!newCurrency || !newCurrency.id) {
            throw new Error('Currency object invalid');
        }

        return await this.currencyRepository.insertOrUpdateCurrency(newCurrency);
    }

    /**
     * Deletes a currency
     * @param currencyId Currency id
     */
    public async deleteCurrencyById(currencyId: string): Promise<boolean> {
        return this.currencyRepository.deleteCurrencyById(currencyId);
    }
}