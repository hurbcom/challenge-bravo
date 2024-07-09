import { Currency } from "./Currency";
import { ExchangeRate } from "./ExchangeRate";

describe("ExchangeRate", () => {
    it("should create an ExchangeRate instance with the correct values", () => {
        const from = new Currency("USD");
        const to = new Currency("EUR");
        const rate = 0.84;
        const exchangeRate = new ExchangeRate(from, to, rate);

        expect(exchangeRate.from).toBe(from);
        expect(exchangeRate.to).toBe(to);
        expect(exchangeRate.rate).toBe(rate);
    });
});
