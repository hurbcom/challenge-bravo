const request = require('supertest');
const app = require("../src/server");

describe("Endpoint acceptance test", () => {

    describe("GET /invalid routes", () => {
        it("Should return error message for all invalid routes", async () => {
            const result = await request(app).get("/123").set('Accept', 'application/json');
            expect(JSON.parse(result.text)).toEqual({ error: "Endpoint invalid" });
            expect(result.status).toEqual(400);
        });
    });


    describe("GET /api/ChangeCurrency", () => {
        
        it("Should return 400 when without 'from' param", async () => {
            const result = await request(app)
                                    .get("/api/ChangeCurrency")
                                    .query({ to: "USD", amount: 10 })
                                    .set('Accept', 'application/json');
            expect(JSON.parse(result.text)).toEqual({ Error: "Invalid params" });
            expect(result.status).toEqual(400);
        });

        it("Should return 400 when without 'to' param", async () => {
            const result = await request(app)
                                    .get("/api/ChangeCurrency")
                                    .query({ from: "USD", amount: 10 })
                                    .set('Accept', 'application/json');
            expect(JSON.parse(result.text)).toEqual({ Error: "Invalid params" });
            expect(result.status).toEqual(400);
        });

        it("Should return 400 when without 'amount' param", async () => {
            const result = await request(app)
                                    .get("/api/ChangeCurrency")
                                    .query({ from: "BRL", to: "USD" })
                                    .set('Accept', 'application/json');

            expect(JSON.parse(result.text)).toEqual({ Error: "Invalid params" });
            expect(result.status).toEqual(400);
        });

        it("Should return 400 when currencies are not accepted in the api", async () => {
            const result = await request(app)
                                    .get("/api/ChangeCurrency")
                                    .query({ from: "PPP", to: "USD", amount: 10 })
                                    .set('Accept', 'application/json');

            expect(JSON.parse(result.text)).toEqual({ Error: "Currency 'from' not accepted" });
            expect(result.status).toEqual(400);
        });

        it("Should return 400 when currencies are not accepted in the api", async () => {
            const result = await request(app)
                                    .get("/api/ChangeCurrency")
                                    .query({ from: "BRL", to: "CCC", amount: 10 })
                                    .set('Accept', 'application/json');

            expect(JSON.parse(result.text)).toEqual({ Error: "Currency 'to' not accepted" });
            expect(result.status).toEqual(400);
        });

        it("Should convert the currency to the country informed", async () => {
            const result = await request(app)
                                    .get("/api/ChangeCurrency")
                                    .query({ from: "BRL", to: "USD", amount: 10 })
                                    .set('Accept', 'application/json');

            expect(JSON.parse(result.text)).toEqual({ query: { from: "BRL", to: "USD", amount: 10 }, result: "1.94" });
            expect(result.status).toEqual(200);
        });

    });


    describe("POST /api/AddCurrency", () => {
        it("Should 400 return when there is no parameter", async () => {
            const result = await request(app).post("/api/AddCurrency?").set('Accept', 'application/json');
            expect(JSON.parse(result.text)).toEqual({ Error: "Invalid params" });
            expect(result.status).toEqual(400);
        });

        it("Should 200 return when add new currency", async () => {
            const result = await request(app)
                                    .post("/api/AddCurrency")
                                    .query({ currency_name: "ABC" })
                                    .set('Accept', 'application/json');

            expect(JSON.parse(result.text)).toEqual({ Message: "Currency successfully registered" });
            expect(result.status).toEqual(200);
        });

        it("Should 400 return when currency exist", async () => {
            const result = await request(app)
                                    .post("/api/AddCurrency")
                                    .query({ currency_name: "ABC" })
                                    .set('Accept', 'application/json');
            
            expect(JSON.parse(result.text)).toEqual({ Error: "Currency exist" });
            expect(result.status).toEqual(400);
        });
    });
    
    
    describe("DELETE /api/RemoveCurrency", () => {
        it("Should 400 return when there is no parameter", async () => {
            const result = await request(app).del("/api/RemoveCurrency?").set('Accept', 'application/json');
            expect(JSON.parse(result.text)).toEqual({ Error: "Invalid params" });
            expect(result.status).toEqual(400);
        });

        it("Should 200 return when remove currency", async () => {
            const result = await request(app)
                                    .del("/api/RemoveCurrency")
                                    .query({ currency_name: "USD" })
                                    .set('Accept', 'application/json');

            expect(JSON.parse(result.text)).toEqual({ Success: "Currency deleted" });
            expect(result.status).toEqual(200);
        });

        it("Should 400 return when currency not found", async () => {
            const result = await request(app)
                                    .del("/api/RemoveCurrency")
                                    .query({ currency_name: "USD" })
                                    .set('Accept', 'application/json');
                                        
            expect(JSON.parse(result.text)).toEqual({ Error: "Currency not found" });
            expect(result.status).toEqual(400);
        });
    });
    
});