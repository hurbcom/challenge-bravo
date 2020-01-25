const convertController = require("../../src/controllers/convertController")
const httpMocks = require("node-mocks-http");
const cacheProvider = require('../../src/services/cacheService').instance();
//const usdBrl = require("../mock-data/usd-brl-convert");
let req, resp, next;


beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        cacheProvider.set("Rates", "BRL", 4.2)
        cacheProvider.set("Rates", "USD", 0.24)
        cacheProvider.set("coins", 'valid', ['BTC', 'ETH', 'USD', 'BRL', 'EUR'])
        cacheProvider.set("Rates", 'base', "USD", 86400000)
    }
);

describe("convertController.get", () => {
    it('should have a get', () => {
        expect(typeof convertController.get).toBe("function");
    });

    it('should have a get', async () => {
        req.query.from = 'USD';
        req.query.amount = '1';
        req.query.to = 'BRL';
        await convertController.get(req, resp, next)
        await expect(res.statusCode).toBe(200);
        await expect(res._isEndCalled).toBeTruthy();

    });
});
