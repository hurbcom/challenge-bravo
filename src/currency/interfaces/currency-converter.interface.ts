import { Currency } from '../definitions/currency';

export interface ICurrencyConverter {
    convert(from: Currency, to: Currency, amount: number): Promise<number>;
}
