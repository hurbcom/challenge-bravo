import { classValidator } from "../Infra/ClassValidator/ClassValidator";
import { Currency } from "./Currency";

describe("Currency Entity", () => {
    it("should be valid", async () => {
        const currency = new Currency({
            id: "HURB",
            sourceType: "fixed",
            dollarRate: 0.7,
            name: "Hurb Coin",
        });
        const isValid = await classValidator(currency);
        expect(isValid).toBe(true);
    });

    it("should be valid without dollarRate and name", async () => {
        const currency = new Currency({
            id: "HURB",
            sourceType: "fixed",
        });
        const isValid = await classValidator(currency);
        expect(isValid).toBe(true);
    });

    it("should not be valid without name", async () => {
        const currency = new Currency({
            id: "",
            sourceType: "fixed",
        });
        await expect(classValidator(currency)).rejects.toThrow(
            "id should not be empty"
        );
    });

    it("should not be valid with wrong source type", async () => {
        const currency = new Currency({
            id: "HURB",
            sourceType: "test",
            dollarRate: 0.7,
            name: "Hurb Coin",
        });
        await expect(classValidator(currency)).rejects.toThrow(
            "sourceType must be one of the following values: fixed, coingate"
        );
    });
});
