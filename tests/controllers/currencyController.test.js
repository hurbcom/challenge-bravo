const chai = require("chai");
chai.use(require("sinon-chai"));
const { expect } = chai;
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const getCurrenciesStub = sandbox.stub();
const getCurrencyStub = sandbox.stub();
const createCurrencyStub = sandbox.stub();
const removeCurrencyStub = sandbox.stub();
const nextStub = sandbox.stub();

const currencyControllers = proxyquire(
    "../../src/controllers/currencyControllers",
    {
        "../services/currencyServices": {
            getCurrencies: getCurrenciesStub,
            getCurrency: getCurrencyStub,
            createCurrency: createCurrencyStub,
            removeCurrency: removeCurrencyStub,
        },
    }
);

let currencies = [
    {
        name: "Real",
        symbol: "BRL",
    },
    {
        name: "Dolar",
        symbol: "USD",
    },
];

let currency = [
    {
        name: "Real",
        symbol: "BRL",
    },
];

describe("CurrencyControllers", () => {
    afterEach(() => sandbox.reset());
    describe("findCurrencies", () => {
        it("Should respond with status 200 and sucessfully call getCurrencies.", async () => {
            getCurrenciesStub.returns(currencies);
            let req = {};
            let res = {
                status: (status) => {
                    return {
                        json: (result) => {
                            expect(status).to.be.equals(200);
                            expect(getCurrenciesStub).to.be.calledOnce;
                            expect(result).to.be.deep.equals({
                                data: [
                                    {
                                        name: "Real",
                                        symbol: "BRL",
                                    },
                                    {
                                        name: "Dolar",
                                        symbol: "USD",
                                    },
                                ],
                            });
                        },
                    };
                },
            };

            await currencyControllers.findCurrencies(req, res);
        });
        it("Should call next passing error.", async () => {
            getCurrenciesStub.throws({
                error: "someError",
            });
            let req = {};
            let res = {};

            await currencyControllers.findCurrencies(req, res, nextStub);

            expect(getCurrenciesStub).to.be.calledOnce;
            expect(nextStub).to.be.calledOnceWith({
                error: "someError",
            });
        });
    });
    describe("findCurrency", () => {
        it("Should respond with status 200 and sucessfully call getCurrency, passing correct params.", async () => {
            getCurrencyStub.returns(currency);
            let req = {
                params: {
                    symbol: "BRL",
                },
            };
            let res = {
                status: (status) => {
                    return {
                        json: (result) => {
                            expect(status).to.be.equals(200);
                            expect(getCurrencyStub).to.be.calledWith("BRL");
                            expect(result).to.be.deep.equals({
                                data: [
                                    {
                                        name: "Real",
                                        symbol: "BRL",
                                    },
                                ],
                            });
                        },
                    };
                },
            };

            await currencyControllers.findCurrency(req, res);
        });

        it("Should call next passing error.", async () => {
            getCurrencyStub.throws({
                error: "someError",
            });
            let req = {
                params: {
                    symbol: "BRL",
                },
            };
            let res = {};

            await currencyControllers.findCurrency(req, res, nextStub);

            expect(getCurrencyStub).to.be.calledOnceWith("BRL");
            expect(nextStub).to.be.calledOnceWith({
                error: "someError",
            });
        });
    });

    describe("createCurrency", () => {
        it("Should respond with status 200 and sucessfully call createCurrency, passing correct params.", async () => {
            createCurrencyStub.returns(currency);
            let req = {
                body: {
                    symbol: "BRL",
                    name: "Real",
                },
            };
            let res = {
                status: (status) => {
                    return {
                        json: (result) => {
                            expect(status).to.be.equals(200);
                            expect(createCurrencyStub).to.be.calledWith({
                                name: "Real",
                                symbol: "BRL",
                            });
                            expect(result).to.be.deep.equals({
                                data: [
                                    {
                                        name: "Real",
                                        symbol: "BRL",
                                    },
                                ],
                            });
                        },
                    };
                },
            };

            await currencyControllers.createCurrency(req, res);
        });
    });

    describe("deleteCurrency", () => {
        it("Should respond with status 200 and sucessfully call deleteCurrency, passing correct params.", async () => {
            removeCurrencyStub.returns(currency);
            let req = {
                params: {
                    symbol: "BRL",
                },
            };
            let res = {
                status: (status) => {
                    return {
                        json: (result) => {
                            expect(status).to.be.equals(200);
                            expect(removeCurrencyStub).to.be.calledWith("BRL");
                            expect(result).to.be.deep.equals({
                                data: [
                                    {
                                        name: "Real",
                                        symbol: "BRL",
                                    },
                                ],
                            });
                        },
                    };
                },
            };

            await currencyControllers.deleteCurrency(req, res);
        });
    });
});
