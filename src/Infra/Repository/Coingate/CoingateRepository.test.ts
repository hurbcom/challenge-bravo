import { CoingateRepository } from "./CoingateRepository";

describe("CoingateRepository", () => {
    let repo: CoingateRepository;

    beforeAll(async () => {
        repo = new CoingateRepository();
    });

    it("should get dollar rate (getExternalDollarValue)", async () => {
        const value = await repo.getExternalDollarValue("BRL");
        expect(value).toBeTruthy();
    });

    it("should get dollar rate (getExternalDollarValue)", async () => {
        const value = await repo.getExternalDollarValue("WWW");
        expect(value).toBeNull();
    });
});
