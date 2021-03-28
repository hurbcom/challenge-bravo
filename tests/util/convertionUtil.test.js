const chai = require("chai");
chai.use(require("sinon-chai"));
const { expect } = chai;
const proxyquire = require("proxyquire");
const sinon = require("sinon");
const sandbox = sinon.createSandbox();
const getRequestStub = sandbox.stub();
const getFromCacheStub = sandbox.stub();
const putToCacheStub = sandbox.stub();

const convertionUtil = proxyquire("../../src/util/convertionUtil", {
    "./requestUtil": getRequestStub,
    "./cacheUtil": {
        getFromCache: getFromCacheStub,
        putToCache: putToCacheStub,
    },
});

describe("ConvertionUtil", () => {
    afterEach(() => sandbox.reset());
    describe("baseCurrencyConvertion", () => {
        it("Should call getRequest when cache does not have avaiable data.", async () => {
            getFromCacheStub.returns(null);
            getRequestStub.onCall(0).returns({
                USD: {
                    high: 2,
                },
            });
            getRequestStub.onCall(1).returns({
                BRL: {
                    high: 1,
                },
            });
            let result = await convertionUtil("BRL");
            expect(result).to.be.equal(0.5);
            expect(getFromCacheStub).to.be.calledOnceWith(
                "https://economia.awesomeapi.com.br/json/all/USD-BRL"
            );
            expect(getRequestStub).to.be.calledWith(
                "https://economia.awesomeapi.com.br/json/all/USD-BRL"
            );
            expect(putToCacheStub).to.calledWith(
                "https://economia.awesomeapi.com.br/json/all/USD-BRL",
                {
                    USD: {
                        high: 2,
                    },
                }
            );
        });

        it("Should call getRequest when cache does not have avaiable data.", async () => {
            getFromCacheStub.returns({
                USD: {
                    high: 2,
                },
            });
            let result = await convertionUtil("BRL");
            expect(result).to.be.equal(0.5);
            expect(getFromCacheStub).to.be.calledOnceWith(
                "https://economia.awesomeapi.com.br/json/all/USD-BRL"
            );
            expect(getRequestStub).to.not.be.called;
        });
    });
});
