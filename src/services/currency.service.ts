import { CurrencyRepository } from "../repositories/currency.repository";
import { Currency } from "../models/currency.model";
import { injectable, inject } from 'inversify';

@injectable()
export class CurrencyService {
    /**
     *
     */
    constructor(
        @inject(CurrencyRepository) private currencyRepository: CurrencyRepository
    ) { }

    public getCurrencyById(id: string): Currency | null {
        if (!id) {
            throw new Error('Currency id required');
        }

        return this.currencyRepository.getCurrencyById(id);
    }

    public insertOrUpdateCurrency(newCurrency: Currency): Currency {
        if (!newCurrency || !newCurrency.isValid()) {
            throw new Error('Currency object invalid');
        }

        return this.currencyRepository.insertOrUpdateCurrency(newCurrency);
    }
}