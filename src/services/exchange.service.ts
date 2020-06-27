import { injectable, inject } from "inversify";
import { CurrencyService } from "./currency.service";

@injectable()
export class ExchangeService {
    /**
     *
     */
    constructor(
        @inject(CurrencyService) private currencyService: CurrencyService
    ) {
        
    }

    public convertCurrency(fromCurrencyId: string, toCurrencyId: string, ammount: number): number {
        const fromCurrency = this.currencyService.getCurrencyById(fromCurrencyId);
        const toCurrency = this.currencyService.getCurrencyById(toCurrencyId);

        if (!fromCurrency || !toCurrency)
            throw new Error("One or more currencies were not found");

        if (fromCurrency.id == 'USD')
            return ammount * toCurrency.usdValue;
        else if (toCurrency.id == 'USD')
            return ammount / fromCurrency.usdValue;
        else 
            return (ammount * toCurrency.usdValue) / fromCurrency.usdValue;
    }
}