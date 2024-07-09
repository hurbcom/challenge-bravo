import mongoose from "mongoose";
import { CurrencyService } from "./CurrencyService";
import { Currency } from "../domain/Currency";
import CurrencyModel from "../infrastructure/models/CurrencyModel";
import ExchangeRateModel from "../infrastructure/models/ExchangeRateModel";
import { CurrencyRepository } from "../infrastructure/repositories/CurrencyRepository";

describe("CurrencyService", () => {
    let currencyService: CurrencyService;
    let repository: CurrencyRepository;

    beforeAll(async () => {
        const url =
            process.env.MONGODB_URI || "mongodb://localhost:27017/currencyDB";
        await mongoose.connect(url);
        repository = new CurrencyRepository();
        currencyService = new CurrencyService(repository);
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

    it("should convert currency correctly", async () => {
        const fromCurrency = new Currency("USD");
        const toCurrency = new Currency("EUR");
        const amount = 100;
        jest.spyOn(repository, "getExchangeRate").mockResolvedValue({
            rate: 0.84,
            from: fromCurrency,
            to: toCurrency,
        });

        const result = await currencyService.convert(
            fromCurrency,
            toCurrency,
            amount
        );
        expect(repository.getExchangeRate).toHaveBeenCalledWith(
            fromCurrency,
            toCurrency
        );
        expect(result).toBeCloseTo(84);
    });

    it("should add a currency", async () => {
        const currency = new Currency("USD");
        jest.spyOn(repository, "addCurrency").mockResolvedValue();
        await currencyService.addCurrency(currency);
        expect(repository.addCurrency).toHaveBeenCalledWith(currency);
    });

    it("should remove a currency", async () => {
        const currency = new Currency("USD");
        await currencyService.addCurrency(currency);
        jest.spyOn(repository, "removeCurrency").mockResolvedValue({
            deletedCount: 1,
        });

        const result = await currencyService.removeCurrency(currency);
        expect(repository.removeCurrency).toHaveBeenCalledWith(currency);
        expect(result.deletedCount).toBe(1);
    });

    it("should add exchange rate", async () => {
        const fromCurrency = new Currency("USD");
        const toCurrency = new Currency("EUR");
        const rate = 0.84;
        jest.spyOn(repository, "addExchangeRate").mockResolvedValue();
        await currencyService.addExchangeRate(fromCurrency, toCurrency, rate);
        expect(repository.addExchangeRate).toHaveBeenCalledWith(
            fromCurrency,
            toCurrency,
            rate
        );
    });
});
