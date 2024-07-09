import mongoose from "mongoose";
import CurrencyModel from "../models/CurrencyModel";
import ExchangeRateModel from "../models/ExchangeRateModel";
import { CurrencyRepository } from "./CurrencyRepository";
import { Currency } from "../../domain/Currency";

describe("CurrencyRepository", () => {
    let repository: CurrencyRepository;

    beforeAll(async () => {
        const url =
            process.env.MONGODB_URI || "mongodb://localhost:27017";
        await mongoose.connect(url);
        repository = new CurrencyRepository();
        await CurrencyModel.deleteMany({});
        await ExchangeRateModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await CurrencyModel.deleteMany({});
        await ExchangeRateModel.deleteMany({});
        jest.clearAllMocks();
    });

    it("should add a currency", async () => {
        const currency = new Currency("USD");
        await repository.addCurrency(currency);
        const savedCurrency = await CurrencyModel.findOne({
            code: "USD",
        }).exec();
        expect(savedCurrency).toBeDefined();
        expect(savedCurrency?.code).toBe("USD");
    });

    it("should remove a currency", async () => {
        const currency = new Currency("USD");
        await CurrencyModel.create({ code: "USD" });
        const result = await repository.removeCurrency(currency);
        expect(result.deletedCount).toBe(1);
    });

    it("should get exchange rate", async () => {
        const from = new Currency("USD");
        const to = new Currency("EUR");
        const rate = 0.84;
        await repository.addExchangeRate(from, to, rate);

        const exchangeRate = await repository.getExchangeRate(from, to);
        expect(exchangeRate.from).toBe(from);
        expect(exchangeRate.to).toBe(to);
        expect(exchangeRate.rate).toBe(rate);
    });

    it("should throw error when exchange rate not found", async () => {
        const from = new Currency("USD");
        const to = new Currency("EUR");

        await expect(repository.getExchangeRate(from, to)).rejects.toThrow(
            `No exchange rate found for ${from.code} to ${to.code}`
        );
    });

    it("should add exchange rate", async () => {
        const from = new Currency("USD");
        const to = new Currency("EUR");
        const rate = 0.84;

        await repository.addExchangeRate(from, to, rate);
        const savedExchangeRate = await ExchangeRateModel.findOne({
            from: "USD",
            to: "EUR",
        }).exec();
        expect(savedExchangeRate).toBeDefined();
        expect(savedExchangeRate?.rate).toBe(0.84);
    });
});
