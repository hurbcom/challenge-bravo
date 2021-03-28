const chai = require("chai");
chai.use(require("sinon-chai"));
const { expect } = chai;
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const baseCurrencyConvertionStub = sandbox.stub();

const convertionServices = proxyquire("../../src/services/convertionServices", {
    "../util/convertionUtil": baseCurrencyConvertionStub,
});

let dummyData = {
    from: "BRL",
    to: "USD",
    amount: 5,
};

describe("ConvertionServices", () => {
    afterEach(() => sandbox.reset());
    describe("convert", () => {
        it("Should correctly return converted value based on API response", async () => {
            baseCurrencyConvertionStub.onCall(0).returns(10);
            baseCurrencyConvertionStub.onCall(1).returns(2);
            let result = await convertionServices.convert(
                dummyData.from,
                dummyData.to,
                dummyData.amount
            );
            expect(result).to.be.equal(25);
        });
    });
});
