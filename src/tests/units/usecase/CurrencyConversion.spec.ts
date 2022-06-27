import { CurrencyRepositoryMemory } from "@/domain/repository";
import { CurrencyConversion } from "@/domain/useCase";

describe("Use case of Curreny", () => {
    let usecase: CurrencyConversion;

    beforeAll(() => {
        const repository = new CurrencyRepositoryMemory();
        usecase = new CurrencyConversion(repository);
    });

    it("Should be possible convert BRL->USD", async () => {
        const result = await usecase.convert("BRL", "USD", 1);
        expect(result).toEqual({ from: "BRL", to: "USD", value: 0.19444 });
    });

    it("Should be possible convert BRL->EUR", async () => {
        const result = await usecase.convert("BRL", "EUR", 1);
        expect(result).toEqual({ from: "BRL", to: "EUR", value: 0.18465 });
    });

    it("Should return erro when amount is zero", async () => {
        await expect(usecase.convert("BRL", "EUR", 0)).rejects.toThrowError(
            "Amount can't be negative or zero"
        );
    });

    it("Should return erro when amount is negative", async () => {
        await expect(usecase.convert("BRL", "EUR", -1)).rejects.toThrowError(
            "Amount can't be negative or zero"
        );
    });

    it("Should return erro when currency not exist", async () => {
        const codeNotExist = "xyz";
        await expect(
            usecase.convert(codeNotExist, "EUR", 1)
        ).rejects.toThrowError(`The currency ${codeNotExist} not found`);

        await expect(
            usecase.convert("EUR", codeNotExist, 1)
        ).rejects.toThrowError(`The currency ${codeNotExist} not found`);
    });
});
