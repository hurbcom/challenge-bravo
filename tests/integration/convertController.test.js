const httpMocks = require("node-mocks-http");
const cacheProvider = require('../../src/services/cacheService').instance();
const app = require("../../src/app.js");
const request = require("supertest");
const endpointUrl = "/convert";
const usdBrl = require("../mock-data/usd-brl-convert.json");
const brlUSD = require("../mock-data/brl-usd-convert.json");
const brlBtc = require("../mock-data/brl-btc-convert.json");

beforeEach(() => {
    cacheProvider.set("Rates", "BRL", 4.226)
    cacheProvider.set("Rates", "USD", 0.24)
    cacheProvider.set("Rates", "BRL", 4.226)
    cacheProvider.set("Rates", "BTC", 0.0001191)

    cacheProvider.set("currencies", 'valid', ['BTC', 'ETH', 'USD', 'BRL', 'EUR'])
    cacheProvider.set("Rates", 'base', "USD", 86400000)

});

describe("convertController.get", () => {
    test("should return 200 OK" + endpointUrl + "/?from=USD&to=BRL&amount=2", async () => {
        const response = await request(app).get(endpointUrl + "/?from=USD&to=BRL&amount=2");
        expect(response.statusCode).toBe(200);
        let rates = JSON.parse(JSON.stringify(response.body));
        expect(rates).toStrictEqual(usdBrl);

    });

    test("should return 200 OK " + endpointUrl+ "/?from=BRL&to=BTC&amount=2", async () => {
        const response = await request(app).get(endpointUrl + "/?from=BRL&to=BTC&amount=2");
        expect(response.statusCode).toBe(200);
        let rates = JSON.parse(JSON.stringify(response.body));
        expect(rates).toStrictEqual(brlBtc);
    });


    test("should return 200 OK " + endpointUrl, async () => {
        const response = await request(app).get("/convert/USD/BRL/2");
        expect(response.statusCode).toBe(200);
        let rates = JSON.parse(JSON.stringify(response.body));
        expect(rates).toStrictEqual(usdBrl);
    });


    test("should return 200 OK " + endpointUrl, async () => {
        const response = await request(app).get("/convert/BRL/USD/2");
        expect(response.statusCode).toBe(200);
        let rates = JSON.parse(JSON.stringify(response.body));
        expect(rates).toStrictEqual(brlUSD);
    });


    test("should handle 400 " + endpointUrl, async () => {
        const response = await request(app).get("/convert/USD/BRL/x");
        expect(response.statusCode).toBe(400);
    });
    test("should handle 400 " + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl + "?from=USD&to=BRL&amount=x");
        expect(response.statusCode).toBe(400);
    });

    test("should handle 400 " + endpointUrl, async () => {
        const response = await request(app).get("/convert/USD/X/2");
        expect(response.statusCode).toBe(400);
    });
    test("should handle 400 " + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl + "?from=USD&to=X&amount=2");
        expect(response.statusCode).toBe(400);
    });

    test("should handle 400" + endpointUrl, async () => {
        const response = await request(app).get("/convert/X/USD/2");
        expect(response.statusCode).toBe(400);
    });
    test("should handle 400" + endpointUrl, async () => {
        const response = await request(app).get(endpointUrl + "?from=X&to=USD&amount=2");
        expect(response.statusCode).toBe(400);
    });

});
