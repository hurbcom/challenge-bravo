import { Currency } from '../../definitions/currency';
import { ICurrencyConverter } from '../../interfaces/currency-converter.interface';

export class CurrencyConverterService implements ICurrencyConverter {
    async convert(
        from: Currency,
        to: Currency,
        amount: number,
    ): Promise<number> {
        return 1;
    }
}
