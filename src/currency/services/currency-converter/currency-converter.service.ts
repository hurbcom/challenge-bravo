import { Currency, ICurrencyConverter } from '../../definitions/currency';

export class CurrencyConverterService implements ICurrencyConverter {
    async convert(
        from: Currency,
        to: Currency,
        amount: number,
    ): Promise<number> {
        return 1;
    }
}
