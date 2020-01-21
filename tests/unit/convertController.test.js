const convertController = require("../../src/controllers/convertController")
const httpMocks = require("node-mocks-http");
const cacheProvider = require('../../src/services/cacheService').instance();

const app = require("../../src/app.js");
const request = require("supertest");
const endpointUrl = "/convert";


let req, resp, next;


beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        cacheProvider.set("USD", "BRL", 4.2)
        cacheProvider.set("BRL", "USD", 0.24)
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

    test("GET by Id " + endpointUrl + ":todoId", async () => {
        const response = await request(app).get(endpointUrl + "/?from=USD&to=BRL&amount=2");
        expect(response.statusCode).toBe(200);
        let rates = JSON.parse(JSON.stringify(response.body));
        console.log(rates)
    });
});
