const httpMocks = require("node-mocks-http");
const cacheProvider = require('../../src/services/cacheService').instance();
const app = require("../../src/app.js");
const request = require("supertest");
const endpointUrl = "/admin/convert";
const adminGetConvert = require("../mock-data/admin-get-convert.json");

beforeEach(() => {
    cacheProvider.set("Rates", "BRL", 4.226)
    cacheProvider.set("Rates", "USD", 1)
    cacheProvider.set("Rates", "BRL", 4.226)
    cacheProvider.set("Rates", "BTC", 0.0001191)
    cacheProvider.set("Rates", "EUR", 0.9077)
    cacheProvider.set("Rates", "ETH", 0.00619)
    cacheProvider.set("currencies", 'valid', ['BTC', 'ETH', 'USD', 'BRL', 'EUR'])
    cacheProvider.set("Rates", 'base', "USD", 86400000)

});

describe("convertController.get", () => {
    test("should return 200 OK" + endpointUrl + "", async () => {
        console.log(endpointUrl);
        const response = await request(app).get(endpointUrl);
        expect(response.statusCode).toBe(200);
        let rates = JSON.parse(JSON.stringify(response.body));
        expect(rates.USD['value']).toStrictEqual(adminGetConvert.USD.value);
        expect(rates.EUR['value']).toStrictEqual(adminGetConvert.EUR.value);
        expect(rates.BRL['value']).toStrictEqual(adminGetConvert.BRL.value);
        expect(rates.BTC['value']).toStrictEqual(adminGetConvert.BTC.value);
        expect(rates.base['value']).toStrictEqual(adminGetConvert.base.value);
        expect(rates.ETH['value']).toStrictEqual(adminGetConvert.ETH.value);

    });

    test("HTTP DELETE", async () => {
        const res = await request(app)
            .delete(endpointUrl + "/USD")
            .send();
        expect(res.statusCode).toBe(201);
    });

    it("PUT " + endpointUrl, async () => {
        const res = await request(app)
            .put(endpointUrl)
            .send({
                "currency": "USD"
            });
        expect(res.statusCode).toBe(201);
    });

    it("PUT " + endpointUrl, async () => {
        const del = await request(app)
            .delete(endpointUrl + "/USD")
            .send();

        const res = await request(app)
            .put(endpointUrl)
            .send({
                "currency": "USD"
            });
        expect(res.statusCode).toBe(400);
    });


    it("PUT " + endpointUrl, async () => {
        const res = await request(app)
            .put(endpointUrl)
            .send({
                "currency": "USD2"
            });
        expect(res.statusCode).toBe(400);
    });

    it("POST " + endpointUrl, async () => {
        const res = await request(app)
            .post(endpointUrl)
            .send({
                "currency": "USD"
            });
        expect(res.statusCode).toBe(400);
        const del = await request(app)
            .delete(endpointUrl + "/USD")
            .send();
        const res2 = await request(app)
            .post(endpointUrl)
            .send({
                "currency": "USD"
            });
        expect(res2.statusCode).toBe(201);
    });

    it("should return error 500 on malformed data with POST" + endpointUrl,
        async () => {
            const response = await request(app)
                .post(endpointUrl)
                .send({title: "Missing done property"});
            expect(response.statusCode).toBe(400);
        }
    );
});
