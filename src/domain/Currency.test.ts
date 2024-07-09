import { Currency } from "./Currency";

describe("Currency", () => {
    it("should create a Currency instance with the correct code", () => {
        const currency = new Currency("USD");
        expect(currency.code).toBe("USD");
    });
});
