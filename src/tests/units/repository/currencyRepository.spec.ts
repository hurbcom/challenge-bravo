import { CurrencyExchange } from "@/domain/entity";
import {
    CurrencyRepository,
    CurrencyRepositoryMemory,
} from "@/domain/repository";

describe("Curreny Repository Memory", () => {
    let currencyRepositoryMemory: CurrencyRepository;
    const date = new Date();

    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(date);
        currencyRepositoryMemory = new CurrencyRepositoryMemory();
    });

    it("Should be possible get all currency in repository", async () => {
        const result = await currencyRepositoryMemory.findAll();
        expect(result.length).toEqual(5);
    });

    it("Should be possible update currency in repository", async () => {
        const result = await currencyRepositoryMemory.update("BrL", 0.23123);
        expect(result).toEqual({
            code: "BRL",
            name: "Real brasileiro",
            value: 0.23123,
            createdAt: date,
            updatedAt: date,
        });
    });

    it("Should be possible remove any currency in repository", async () => {
        let result = await currencyRepositoryMemory.findAll();
        expect(result.length).toEqual(5);
        await currencyRepositoryMemory.remove("BRL");
        result = await currencyRepositoryMemory.findAll();
        expect(result.length).toEqual(4);
    });

    it("Should be possible to add currency in repository", async () => {
        const currencyCreated = await currencyRepositoryMemory.create({
            code: "gta",
            name: "GTA Online",
            value: 19.99,
        });
        const result = await currencyRepositoryMemory.findAll();
        const currencyFind = result.find(
            (currency) => currency === currencyCreated
        );
        expect(result.length).toEqual(6);
        expect(currencyCreated).toEqual(currencyFind);
    });

    it("Should return error when currency already exists in repository", async () => {
        const usd = new CurrencyExchange({
            code: "usd",
            name: "Dolar",
            value: 2,
        });
        await expect(currencyRepositoryMemory.create(usd)).rejects.toThrowError(
            `The currency ${usd.code} already exists`
        );
    });

    it("Should be possible to find currency by code", async () => {
        const result = await currencyRepositoryMemory.getByCode("USD");
        expect(result).toEqual({
            code: "USD",
            name: "Dólar dos EUA",
            value: 1,
            createdAt: date,
            updatedAt: date,
        });
    });

    it("Should return undefined when not find currency by code", async () => {
        const result = await currencyRepositoryMemory.getByCode("xyz");
        expect(result).toBe(undefined);
    });
});
