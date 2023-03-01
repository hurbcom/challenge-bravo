import { CurrencyRedisRepository } from "./CurrencyRedisRepository";

describe("CurrencyRedisRepository", () => {
    let repo: CurrencyRedisRepository;

    beforeAll(async () => {
        repo = new CurrencyRedisRepository();
        await repo.reset();
    });

    afterAll(async () => {
        await repo.close();
    });

    it("should get all Currency (getAllCurrencies)", async () => {
        const value = await repo.getAllCurrencies();
        expect(value.length).toBe(5);
    });

    it("should get Currency (getCurrency)", async () => {
        const value = await repo.getCurrency("BRL");
        expect(value?.id).toBe("BRL");
        expect(value?.sourceType).toBe("coingate");
    });

    it("should get null to Currency when not exist (getCurrency)", async () => {
        const value = await repo.getCurrency("HURB");
        expect(value).toBe(null);
    });

    it("should set dollar rate to BRL (setDollarRate)", async () => {
        await repo.setCurrency({
            id: "HURB",
            sourceType: "fixed",
            dollarRate: 0.9,
        });
        const value = await repo.getCurrency("HURB");
        expect(value?.id).toBe("HURB");
        expect(value?.sourceType).toBe("fixed");
        expect(value?.dollarRate).toBe(0.9);
    });

    it("should get dollar rate to HURB (getDollarRate)", async () => {
        const value = await repo.getDollarRate("HURB");
        expect(value).toBe(0.9);
    });

    it("should get value null to dollar rate when not exist (getDollarRate)", async () => {
        const value = await repo.getDollarRate("BRL");
        expect(value).toBe(null);
    });

    it("should set dollar rate to HURB (setDollarRate)", async () => {
        await repo.setDollarRate("HURB", 0.3);
        const value = await repo.getDollarRate("HURB");
        expect(value).toBe(0.3);
    });
});
