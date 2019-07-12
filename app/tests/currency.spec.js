const expect = require("chai").expect;

const validators = require("../src/validators/currency")();
const currencyCache = require("../src/cache/currency")(null);
const currencyModel = require("../src/models/currency")({
    src: {
        cache: {
            currency: currencyCache
        }
    }
});
const currencyController = require("../src/controllers/currency")({
    src: {
        models: {
            currency: currencyModel
        }
    }
});

describe("Currency.js", () => {
    it("verifica a existência de todos os campos na requisição", () => {
        const request = {
            query: {}
        };

        try {
            validators.convert_parameters(request);
        } catch (error) {
            expect(error.message).to.equal(
                "Ops! Incomplete parameters (from, to or amount). :("
            );
        }
    });

    it("verifica a existência do campo 'amount' na requisição", () => {
        const request = {
            query: {
                from: "usd",
                to: "brl"
            }
        };

        try {
            validators.convert_parameters(request);
        } catch (error) {
            expect(error.message).to.equal(
                "Ops! Incomplete parameters (from, to or amount). :("
            );
        }
    });

    it("verifica a existência do campo 'from' na requisição", () => {
        const request = {
            query: {
                to: "brl",
                amount: 1000
            }
        };

        try {
            validators.convert_parameters(request);
        } catch (error) {
            expect(error.message).to.equal(
                "Ops! Incomplete parameters (from, to or amount). :("
            );
        }
    });

    it("verifica a existência do campo 'to' na requisição", () => {
        const request = {
            query: {
                from: "usd",
                amount: 1000
            }
        };

        try {
            validators.convert_parameters(request);
        } catch (error) {
            expect(error.message).to.equal(
                "Ops! Incomplete parameters (from, to or amount). :("
            );
        }
    });

    it("verifica se a moeda no campo 'from' é aceita para conversão", () => {
        const request = {
            query: {
                from: "not",
                to: "brl",
                amount: 1000
            }
        };

        try {
            validators.convert_parameters(request);
        } catch (error) {
            expect(error.message).to.equal(
                `Ops! ${request.query.from.toUpperCase()} is not a valid currency. :(`
            );
        }
    });

    it("verifica se a moeda no campo 'to' é aceita para conversão", () => {
        const request = {
            query: {
                from: "usd",
                to: "not",
                amount: 1000
            }
        };

        try {
            validators.convert_parameters(request);
        } catch (error) {
            expect(error.message).to.equal(
                `Ops! ${request.query.to.toUpperCase()} is not a valid currency. :(`
            );
        }
    });

    it("verifica se o valor no campo 'amount' é aceito para conversão", () => {
        const request = {
            query: {
                from: "usd",
                to: "brl",
                amount: "money"
            }
        };

        try {
            validators.convert_parameters(request);
        } catch (error) {
            expect(error.message).to.equal(
                `Ops! ${
                    request.query.amount
                } is not a valid value (eg.: 100 or 100.00 or 1000.00). :(`
            );
        }
    });

    it("verifica se o valor do campo 'from' retornado pelo validador está em maiúsculo", () => {
        const request = {
            query: {
                from: "usd",
                to: "brl",
                amount: 10
            }
        };

        const result = validators.convert_parameters(request);

        expect(result.query.from).to.equal("USD");
    });

    it("verifica se o valor do campo 'to' retornado pelo validador está em maiúsculo", () => {
        const request = {
            query: {
                from: "usd",
                to: "brl",
                amount: 10
            }
        };

        const result = validators.convert_parameters(request);

        expect(result.query.to).to.equal("BRL");
    });

    it("verifica retorno do model (requisição ao site cryptocompare.com e/ou cache)", async () => {
        const result = await currencyModel.convert("USD", "BRL");
        expect(result).is.not.null;
    });

    it("verifica retorno da função de cálculo de conversão", () => {
        const result = currencyController._calculate(1, 3.8);
        expect(result).to.equal("3.80");
    });
});
