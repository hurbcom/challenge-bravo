import { injectable, inject } from "inversify";
import { CurrencyService } from "./currency.service";
import { ConvertedCurrency } from "../models/converted-currency.model";
import { CurrencyNotFoundError } from "../infrastructure/errors/currency-not-found.error";

@injectable()
export class ExchangeService {
    /**
     * ExchangeService constructor
     */
    constructor(
        @inject(CurrencyService) private currencyService: CurrencyService
    ) {
        
    }

    /**
     * Converts the ammount from the 'fromCurrency' to the 'toCurrency'
     * @param fromCurrencyId Currency id used as basis
     * @param toCurrencyId Destination currency id
     * @param ammount Ammount to be converted
     */
    public async convertCurrency(fromCurrencyId: string, toCurrencyId: string, ammount: number): Promise<ConvertedCurrency> {
        // Gets both currency objects
        const fromCurrency = await this.currencyService.getCurrencyById(fromCurrencyId);
        const toCurrency = await this.currencyService.getCurrencyById(toCurrencyId);

        // Check if both were found
        if (!fromCurrency || !toCurrency) {
            throw new CurrencyNotFoundError("One or more currencies were not found");
        }

        let convertedAmmount: number;

        // Applies the conversion
        if (fromCurrency.id == 'USD')
            convertedAmmount = ammount * toCurrency.usdRate;
        else if (toCurrency.id == 'USD')
            convertedAmmount = ammount / fromCurrency.usdRate;
        else 
            convertedAmmount =  (ammount * toCurrency.usdRate) / fromCurrency.usdRate;
        
        return new ConvertedCurrency(convertedAmmount, fromCurrency, toCurrency);
    }
}