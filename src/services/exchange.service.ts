import { injectable, inject } from "inversify";
import { CurrencyService } from "./currency.service";
import { ConvertedCurrency } from "../models/converted-currency.model";

@injectable()
export class ExchangeService {
    /**
     *
     */
    constructor(
        @inject(CurrencyService) private currencyService: CurrencyService
    ) {
        
    }

    public async convertCurrency(fromCurrencyId: string, toCurrencyId: string, ammount: number): Promise<ConvertedCurrency> {
        const fromCurrency = await this.currencyService.getCurrencyById(fromCurrencyId);
        const toCurrency = await this.currencyService.getCurrencyById(toCurrencyId);

        if (!fromCurrency || !toCurrency)
            throw new Error("One or more currencies were not found");

        let convertedAmmount: number;

        if (fromCurrency.id == 'USD')
            convertedAmmount = ammount * toCurrency.usdRate;
        else if (toCurrency.id == 'USD')
            convertedAmmount = ammount / fromCurrency.usdRate;
        else 
            convertedAmmount =  (ammount * toCurrency.usdRate) / fromCurrency.usdRate;
        
        return new ConvertedCurrency(convertedAmmount, fromCurrency, toCurrency);
    }
}