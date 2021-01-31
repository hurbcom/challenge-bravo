const testDbContext = require("../testDbContext");
const currenciesService = require("../../src/services/currenciesService");
const currencyExchangeService = require("../../src/services/currencyExchangeService");
const configService = require("../../src/services/configService");
const getCurrencyMockedResponse = require("../getCurrencyMockResponse.json");
const currenciesDao = require("../../src/database/currenciesDao");

beforeAll(() => testDbContext.connect());
afterAll(() => testDbContext.closeDatabase());

jest.spyOn(currencyExchangeService, 'getCurrency').mockImplementation(() => {
    return getCurrencyMockedResponse;
});

jest.spyOn(console, "error").mockImplementation()

describe("service", () => {
    beforeEach(() => configService.seedDatabase());
    afterEach(() => testDbContext.clearDatabase());

    describe("addCurrency", () => {
        it("Should add a currency correctly on the database", async () => {
            const newCurrencyCode = "BAM";

            const expectedMessage = `Currency ${newCurrencyCode} successfully registered.`;

            await expect(
                currenciesService.addCurrency(newCurrencyCode)
            ).resolves.toEqual(expectedMessage);
        });

        it("Should return a error message if no currency is provided", async () => {
            const newCurrencyCode = "";

            const expectedMessage =
                "Error while registering currency: Currency  not supported.";

            await expect(
                currenciesService.addCurrency(newCurrencyCode)
            ).rejects.toThrow(expectedMessage);
        });

        it("Should throw an error if the currency provided does not exist", async () => {
            const newCurrencyCode = "WRONG";

            const expectedMessage =
                "Error while registering currency: Currency WRONG not supported.";

            await expect(
                currenciesService.addCurrency(newCurrencyCode)
            ).rejects.toThrow(expectedMessage);
        });

        it("Should throw an error if the currency provided already exists", async () => {
            const newCurrencyCode = "USD";

            const expectedMessage = `Error while registering currency: Currency ${newCurrencyCode} already registered.`;

            await expect(
                currenciesService.addCurrency(newCurrencyCode)
            ).rejects.toThrow(expectedMessage);
        });
    });

    describe("removeCurrency", () => {
        it("Should remove a currency correctly from the database", async () => {
            const currencyToDelete = "BRL";
            const expectedMessage = `Currency ${currencyToDelete} successfully deleted.`;
            const res = await currenciesService.removeCurrency(
                currencyToDelete
            );
            expect(res).toEqual(expectedMessage);
        });

        it("should throw an exception if the currency provided does not exist", async () => {
            const currencyToDelete = "JPY";
            const expectedMessage = `Error while deleting currency: Currency ${currencyToDelete} is not registered.`;

            await expect(currenciesService.removeCurrency(
                currencyToDelete
            )).rejects.toThrow(expectedMessage);
        });
    });

    describe("convertCurrency", () => {
        it("Should convert the currency correctly", async () => {
            const from = "BRL";
            const to = "USD";
            const amount = 10;
            const expectedResult = "1.8470";

            const res = await currenciesService.convertCurrency(
                from,
                to,
                amount
            );

            expect(res).toEqual(expectedResult);
        });

        it("Should convert the same currency correctly", async () => {
            const from = "EUR";
            const to = "EUR";
            const amount = 10;
            const expectedResult = "10.0000";

            const res = await currenciesService.convertCurrency(
                from,
                to,
                amount
            );

            expect(res).toEqual(expectedResult);
        });

        it("Should throw an error if the 'to' currency is unsupported", async () => {
            const from = "EUR";
            const to = "JPY";
            const amount = 10;
            const expectedError = `Unsupported currencies: ${to}`;

            await expect(currenciesService.convertCurrency(
                from,
                to,
                amount
            )).rejects.toThrow(expectedError);
        });

        it("Should throw an error if the 'from' currency is unsupported", async () => {
            const from = "JPY";
            const to = "EUR";
            const amount = 10;
            const expectedError = `Unsupported currencies: ${from}`;

            await expect(currenciesService.convertCurrency(
                from,
                to,
                amount
            )).rejects.toThrow(expectedError);
        });

        it("Should throw an error if the 'from' and 'to' currencies is unsupported", async () => {
            const from = "JPY";
            const to = "BAM";
            const amount = 10;
            const expectedError = `Unsupported currencies: ${from},${to}`;

            await expect(currenciesService.convertCurrency(
                from,
                to,
                amount
            )).rejects.toThrow(expectedError);
        });

        it("Should throw an error if fails to get information from the database", async () => {
            jest.spyOn(currenciesDao, 'findOne').mockImplementation(() => {
                throw new Error()
            });
            const from = "USD";
            const to = "BRL";
            const amount = 10;
            const expectedError = "Internal server error.";

            await expect(currenciesService.convertCurrency(
                from,
                to,
                amount
            )).rejects.toThrow(expectedError);
        });
    });
});
