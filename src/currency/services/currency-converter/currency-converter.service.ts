import { Cache, ExpirationStrategy, MemoryStorage } from 'node-ts-cache';

import { Currency } from '../../definitions/currency';
import { ICurrencyConverter } from '../../interfaces/currency-converter.interface';
import { CurrencyRatesService } from '../currency-rates/currency-rates.service';

export class CurrencyConverterService implements ICurrencyConverter {
    constructor(private currentRatesService: CurrencyRatesService) {}

    @Cache(new ExpirationStrategy(new MemoryStorage()), {
        ttl: 3600,
    })
    async convert(
        from: Currency,
        to: Currency,
        amount: number,
    ): Promise<number> {
        const rates = await this.currentRatesService.getRates();

        if (from === to) {
            throw new Error(
                'Looks like you are trying to convert the same currency.',
            );
        }

        const fromRate = rates[from];
        const toRate = rates[to];
        const amountConverted = (fromRate / toRate) * amount;

        return amountConverted;
    }
}
