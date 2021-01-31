const testDbContext = require("../testDbContext");
const currenciesService = require("../../src/services/currenciesService");
const currencyExchangeService = require("../../src/services/currencyExchangeService");
const currencyController = require("../../src/controllers/currenciesController");
const getCurrencyMockedResponse = require("../getCurrencyMockResponse.json");

beforeAll(() => testDbContext.connect());
afterAll(() => testDbContext.closeDatabase());

jest.spyOn(currencyExchangeService, "getCurrency").mockImplementation(() => {
    return getCurrencyMockedResponse;
});

describe("controller", () => {
    describe("addCurrency", () => {
        it("Should add a supported currency correctly on the database", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const req = {
                query: {
                    currency: "JPY",
                },
            };
            const successMessage = `Currency ${req.query.currency} successfully registered.`;
            jest.spyOn(currenciesService, "addCurrency").mockImplementation(
                () => {
                    return successMessage;
                }
            );
            const expectedResult = { result: successMessage };

            await currencyController.addCurrency(req, res);
            expect(jsonMock).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to add a currency in lowercase", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    currency: "jpy",
                },
            };

            const expectedResult = {
                message: '"currency" must only contain uppercase characters',
            };

            await currencyController.addCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to add a currency with more than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    currency: "JPYS",
                },
            };

            const expectedResult = {
                message: '"currency" length must be 3 characters long',
            };

            await currencyController.addCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to add a currency with more than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    currency: "JPYS",
                },
            };

            const expectedResult = {
                message: '"currency" length must be 3 characters long',
            };

            await currencyController.addCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to add a currency with less than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    currency: "JP",
                },
            };

            const expectedResult = {
                message: '"currency" length must be 3 characters long',
            };

            await currencyController.addCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to add an undefined currency", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {},
            };

            const expectedResult = { message: '"currency" is required' };

            await currencyController.addCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });
    });

    describe("removeCurrency", () => {
        it("Should remove a supported currency correctly on the database", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const req = {
                query: {
                    currency: "USD",
                },
            };
            const successMessage = `Currency ${req.query.currency} successfully deleted.`;
            jest.spyOn(currenciesService, "removeCurrency").mockImplementation(
                () => {
                    return successMessage;
                }
            );
            const expectedResult = { result: successMessage };

            await currencyController.removeCurrency(req, res);
            expect(jsonMock).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to remove a currency in lowercase", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    currency: "jpy",
                },
            };

            const expectedResult = {
                message: '"currency" must only contain uppercase characters',
            };

            await currencyController.removeCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to remove a currency with more than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    currency: "JPYS",
                },
            };

            const expectedResult = {
                message: '"currency" length must be 3 characters long',
            };

            await currencyController.removeCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to remove a currency with less than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    currency: "JP",
                },
            };

            const expectedResult = {
                message: '"currency" length must be 3 characters long',
            };

            await currencyController.removeCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to remove an undefined currency", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {},
            };

            const expectedResult = { message: '"currency" is required' };

            await currencyController.removeCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });
    });

    describe("convertCurrency", () => {
        it("Should retrurn the converted value correctly", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const req = {
                query: {
                    from: "USD",
                    to: "BRL",
                    amount: "1",
                },
            };
            jest.spyOn(currenciesService, "convertCurrency").mockImplementation(
                () => {
                    return getCurrencyMockedResponse.data.rates[req.query.from];
                }
            );
            const expectedResult = {
                result: getCurrencyMockedResponse.data.rates[req.query.from],
            };

            await currencyController.convertCurrency(req, res);
            expect(jsonMock).toHaveBeenCalled();
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert 'to' parameter in lowercase", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USD",
                    to: "brl",
                    amount: "1",
                },
            };

            const expectedResult = {
                message: '"to" must only contain uppercase characters',
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert 'to' parameter with more than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USD",
                    to: "BRLS",
                    amount: "1",
                },
            };

            const expectedResult = {
                message: '"to" length must be 3 characters long',
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert 'to' parameter with less than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USD",
                    to: "BR",
                    amount: "1",
                },
            };

            const expectedResult = {
                message: '"to" length must be 3 characters long',
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert an undefined 'to' parameter", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USD",
                    amount: "1",
                },
            };

            const expectedResult = { message: '"to" is required' };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert 'from' parameter in lowercase", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "usd",
                    to: "BRL",
                    amount: "1",
                },
            };

            const expectedResult = {
                message: '"from" must only contain uppercase characters',
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert 'from' parameter with more than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USDS",
                    to: "BRL",
                    amount: "1.05",
                },
            };

            const expectedResult = {
                message: '"from" length must be 3 characters long',
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert 'from' parameter with less than 3 characters", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "US",
                    to: "BRL",
                    amount: "1",
                },
            };

            const expectedResult = {
                message: '"from" length must be 3 characters long',
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert an undefined 'from' parameter", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    to: "BRL",
                    amount: "1",
                },
            };

            const expectedResult = { message: '"from" is required' };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert if 'amount' is negative", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USD",
                    to: "BRL",
                    amount: "-1",
                },
            };

            const expectedResult = {
                message:
                    "Amount must be a positive number with '.' as decimal delimiter.",
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert if 'amount' is separated with ','", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USD",
                    to: "BRL",
                    amount: "1,15",
                },
            };

            const expectedResult = {
                message:
                    "Amount must be a positive number with '.' as decimal delimiter.",
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });

        it("Should fail to convert an undefined 'amount'", async () => {
            const res = {};
            const jsonMock = jest.fn();
            res.json = jsonMock;
            const statusMock = jest.fn().mockReturnValue(res);
            res.status = statusMock;

            const req = {
                query: {
                    from: "USD",
                    to: "BRL",
                },
            };

            const expectedResult = {
                message:
                    "Amount must be a positive number with '.' as decimal delimiter.",
            };

            await currencyController.convertCurrency(req, res);
            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(expectedResult);
        });
    });
});
