import mongoose from "mongoose";
import ExchangeRateModel from "./ExchangeRateModel";

interface MongoError extends Error {
    code: number;
}

describe("ExchangeRate Model Test", () => {
    beforeAll(async () => {
        const url =
            process.env.MONGODB_URI || "mongodb://localhost:27017/currencyDB";
        await mongoose.connect(url);
        await ExchangeRateModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await ExchangeRateModel.deleteMany({});
    });

    it("should create a new exchange rate", async () => {
        const exchangeRateData = {
            from: "USD",
            to: "EUR",
            rate: 0.84,
        };

        const exchangeRate = new ExchangeRateModel(exchangeRateData);
        const savedExchangeRate = await exchangeRate.save();

        expect(savedExchangeRate._id).toBeDefined();
        expect(savedExchangeRate.from).toBe("USD");
        expect(savedExchangeRate.to).toBe("EUR");
        expect(savedExchangeRate.rate).toBeCloseTo(0.84);
    });

    it("should not create an exchange rate with duplicate 'from' and 'to' currencies", async () => {
        const exchangeRateData = {
            from: "USD",
            to: "EUR",
            rate: 0.84,
        };

        const exchangeRate1 = new ExchangeRateModel(exchangeRateData);
        await exchangeRate1.save();

        const exchangeRate2 = new ExchangeRateModel(exchangeRateData);
        try {
            await exchangeRate2.save();
        } catch (e) {
            const error = e as MongoError;
            expect(error.code).toBe(11000);
        }
    });

    it("should update an exchange rate", async () => {
        const exchangeRateData = {
            from: "USD",
            to: "EUR",
            rate: 0.84,
        };

        const exchangeRate = new ExchangeRateModel(exchangeRateData);
        await exchangeRate.save();

        exchangeRate.rate = 0.85;
        const updatedExchangeRate = await exchangeRate.save();

        expect(updatedExchangeRate.rate).toBeCloseTo(0.85);
    });

    it("should delete an exchange rate", async () => {
        const exchangeRateData = {
            from: "USD",
            to: "EUR",
            rate: 0.84,
        };

        const exchangeRate = new ExchangeRateModel(exchangeRateData);
        await exchangeRate.save();

        await ExchangeRateModel.deleteOne({
            from: "USD",
            to: "EUR",
        });

        const deletedExchangeRate = await ExchangeRateModel.findOne({
            from: "USD",
            to: "EUR",
        });

        expect(deletedExchangeRate).toBeNull();
    });
});
