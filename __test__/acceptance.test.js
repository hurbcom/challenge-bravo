const request = require('supertest');
const app = require("../src/server");

describe("Endpoint acceptance test", () => {

    describe("GET /invalid routes", () => {
        it("Should return error message for all invalid routes", (done) => {
            request(app)
                .get('/123')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .expect('"Endpoint invalid"')
                .end( (error) => {
                    if (error) return done(error);
                    done()                       
                });
        });
    });


    describe("GET /api/ChangeCurrency", () => {
        it("", () => {
            
        });
    });


    describe("POST /api/AddCurrency", () => {
        it("", () => {

        });
    });
    
    
    describe("DELETE /api/RemoveCurrency", () => {
        it("", () => {

        });
    });
    
});