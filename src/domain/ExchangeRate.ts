import type { Currency } from "./Currency";

export class ExchangeRate {
    constructor(
        public from: Currency,
        public to: Currency,
        public rate: number
    ) {}
}
