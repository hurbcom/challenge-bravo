const request = require("supertest");
const { RESTORE } = require("../../cache_config/redisConfig");
const app = require("../../index");
const client = require("../../cache_config/redisConfig")

afterAll( done => {
    console.log("Test ended");
    app.close()
    client.quit();
    done()
});



describe("Testing core routes", () => {


    it("Shoud get main route", async () => {
        const res = await request(app)
            .get("?from=BRL&to=USD&amount=1")

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "data": res.body.data,
            "from": "BRL",
            "to": "USD"
        });
    })


    it("Should create a currency", async() => {
        const res = await request(app)
            .post("/")
            .send({
                currencyName: "ADA",
                exchangePairName: "BRL",
                exchangePairValue: 12
            })
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "CurrencyCreated": "ADA",
            "ExchangeUSDpair": res.body.ExchangeUSDpair
        })
    })



    it("Should remove a currency", async() => {
        const res = await request(app)
            .delete("/?currencyName=ADA")

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({
            "message": "Currency removed",
        })
    })
})



describe("Testing bad form requests", () => {


    it("Should return bad request for not supporting such exchange", async () => {
        const res = await request(app)
            .get("?from=CARDANO&to=USD&amount=1")

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({
            "message": "Currency exchange not supported"
        });
    })

    //Cannot create/update/remove default currencies
    it("Should not create a currency and return forbidden action", async() => {
        const res = await request(app)
            .post("/")
            .send({
                currencyName: "ETH",
                exchangePairName: "BRL",
                exchangePairValue: 12
            })
        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual({
            "message": "Change such currency is not supported",
        })
    })


    it("Should not remove a currency and return forbidden action", async() => {
        const res = await request(app)
            .delete("/?currencyName=USD")

        expect(res.statusCode).toEqual(403);
        expect(res.body).toEqual({
            "message": "Remove such currency is not supported",
        })
    })
})