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

    public async getCurrencyById(id: string): Promise<Currency | null> {
        if (!id) {
            throw new Error('Currency id required');
        }

        const currency = await this.currencyRepository.getCurrencyById(id);

        return currency;
    }

    public async insertOrUpdateCurrency(newCurrency: Currency): Promise<Currency> {

        if (!newCurrency || !newCurrency.id || !newCurrency.usdRate) {
            throw new Error('Currency object invalid');
        }

        return await this.currencyRepository.insertOrUpdateCurrency(newCurrency);
    }
}