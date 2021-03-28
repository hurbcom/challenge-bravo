const chai = require("chai");
chai.use(require("sinon-chai"));
const { expect } = chai;
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const convertStub = sandbox.stub();
const nextStub = sandbox.stub();

const convertionControllers = proxyquire(
    "../../src/controllers/convertionControllers",
    {
        "../services/convertionServices": {
            convert: convertStub,
        },
    }
);

let amount = 25.2;

describe("ConvertionController", () => {
    afterEach(() => sandbox.reset());
    describe("convertCurrency", () => {
        it("Should return converted amount and status 200 if everything goes as expected.", async () => {
            convertStub.returns(amount);
            let req = {
                query: {
                    from: "USD",
                    to: "BRL",
                    amount: 5,
                },
            };
            let res = {
                status: (status) => {
                    return {
                        json: (result) => {
                            expect(status).to.be.equals(200);
                            expect(convertStub).to.be.calledWith(
                                "USD",
                                "BRL",
                                5
                            );
                            expect(result).to.be.deep.equals({
                                data: {
                                    amount: 25.2,
                                },
                            });
                        },
                    };
                },
            };

            await convertionControllers.convertCurrency(req, res);
        });

        it("Should call next passing error.", async () => {
            convertStub.throws({
                error: "someError",
            });
            let req = {
                query: {
                    from: "USD",
                    to: "BRL",
                    amount: 5,
                },
            };
            let res = {};

            await convertionControllers.convertCurrency(req, res, nextStub);

            expect(nextStub).to.be.calledOnceWith({
                error: "someError",
            });
        });
    });
});
