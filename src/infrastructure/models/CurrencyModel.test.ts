import mongoose from "mongoose";
import CurrencyModel from "./CurrencyModel";
interface MongoError extends Error {
    code: number;
}

describe("Currency Model Test", () => {
    beforeAll(async () => {
        const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
        await mongoose.connect(url);
        await CurrencyModel.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await CurrencyModel.deleteMany({});
    });

    it("should create a new currency", async () => {
        const currency = new CurrencyModel({ code: "USD" });
        const savedCurrency = await currency.save();
        expect(savedCurrency._id).toBeDefined();
        expect(savedCurrency.code).toBe("USD");
    });

    it("should not create a currency with duplicate code", async () => {
        const currency1 = new CurrencyModel({ code: "USD" });
        await currency1.save();
        const currency2 = new CurrencyModel({ code: "USD" });
        try {
            await currency2.save();
        } catch (e) {
            const error = e as MongoError;
            expect(error.code).toBe(11000);
        }
    });

    it("should find a currency by code", async () => {
        const currency = new CurrencyModel({ code: "USD" });
        await currency.save();
        const foundCurrency = await CurrencyModel.findOne({ code: "USD" });
        expect(foundCurrency).toBeDefined();
        expect(foundCurrency?.code).toBe("USD");
    });

    it("should update a currency", async () => {
        const currency = new CurrencyModel({ code: "USD" });
        await currency.save();
        currency.code = "EUR";
        const updatedCurrency = await currency.save();
        expect(updatedCurrency.code).toBe("EUR");
    });
});
