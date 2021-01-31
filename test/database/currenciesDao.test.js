const testDbContext = require("../testDbContext");
const currenciesDao = require("../../src/database/currenciesDao");
const configService = require("../../src/services/configService");
const CurrenciesModel = require("../../src/models/currenciesModel");
const currencyExchangeService = require("../../src/services/currencyExchangeService");
const getCurrencyMockedResponse = require("../getCurrencyMockResponse.json");

jest.spyOn(currencyExchangeService, "getCurrency").mockImplementation(() => {
    return getCurrencyMockedResponse;
});

const realRateToBaseMock = 5.4141;
jest.spyOn(console, "error").mockImplementation()


beforeAll(() => testDbContext.connect());
afterAll(() => testDbContext.closeDatabase());

describe("database", () => {
    describe("save", () => {
        it("Should fail saving empty currenncy", async () => {
            const newCurrency = {};
            const expectedError = new Error(
                "Error - Currency validation failed: rateToBase: Path `rateToBase` is required., code: Path `code` is required."
            );
            await expect(currenciesDao.save(newCurrency)).rejects.toEqual(
                expectedError
            );
        });

        it("should save a currency correctly on the database", async () => {
            const newCurrency = new CurrenciesModel({
                code: "USD",
                rateToBase: 1.0,
            });
            const expectedError = new Error(
                "Error - Currency validation failed: rateToBase: Path `rateToBase` is required., code: Path `code` is required."
            );
            const savedCurrency = await currenciesDao.save(newCurrency);
            expect(savedCurrency.code).toEqual(newCurrency.code);
            expect(savedCurrency.rateToBase).toEqual(newCurrency.rateToBase);
        });
    });

    describe("findOneAndDelete", () => {
        beforeEach(() => configService.seedDatabase());
        afterEach(() => testDbContext.clearDatabase());

        it("should fail deleting a currency that doesn't exist", async () => {
            const currencyToDelete = "JPY";

            await expect(
                currenciesDao.findOneAndDelete({ code: currencyToDelete })
            ).resolves.toBeNull();
        });

        it("should delete a currency correctly", async () => {
            const currencyToDelete = "USD";

            const currencyDeleted = await currenciesDao.findOneAndDelete({
                code: currencyToDelete,
            });
            const currencyExist = await CurrenciesModel.find({
                code: currencyToDelete,
            });
            expect(currencyDeleted.code).toEqual(currencyToDelete);
            expect(currencyExist).toEqual([]);
        });
    });

    describe("find", () => {
        beforeEach(() => configService.seedDatabase());
        afterEach(() => testDbContext.clearDatabase());

        it("should returns all currencies", async () => {
            const currencies = await currenciesDao.find({});

            const real = currencies.filter((currency) => {
                return currency.code === "BRL";
            });

            expect(real[0].rateToBase).toEqual(realRateToBaseMock);
            expect(currencies.length).toEqual(
                configService.INITIAL_AVAILABLE_CURRENCIES.length
            );
        });
    });

    describe("findOne", () => {
        beforeEach(() => configService.seedDatabase());
        afterEach(() => testDbContext.clearDatabase());

        it("should returns one currency", async () => {
            const realCode = "BRL";
            const real = await currenciesDao.findOne({ code: realCode });

            expect(real.rateToBase).toEqual(realRateToBaseMock);
            expect(real.code).toEqual(realCode);
        });
    });

    describe("updateOne", () => {
        beforeEach(() => configService.seedDatabase());
        afterEach(() => testDbContext.clearDatabase());

        it("should update one currency", async () => {
            const realCode = 'BRL';
            await currenciesDao.updateOne(
                { code: realCode },
                { $set: { rateToBase: 1 } }
            );

            const real = await currenciesDao.findOne({ code: realCode });

            expect(real.rateToBase).toEqual(1);
            expect(real.code).toEqual(realCode);
        });
    });
});
