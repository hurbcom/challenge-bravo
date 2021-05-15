const request = require("supertest")
const app = require("../../src/app")


describe('Api test',()=>{
    it('should get status 200 on GET /currency/:code',async()=>{
        const response = await request(app)
        .get("/currency/BRL")

        expect(response.status).toBe(200)
    })

    it('should get status 400 on GET /currency/:code',async()=>{
        const response = await request(app)
        .get("/currency/ZZY")
        expect(response.status).toBe(400)
    })

    it('should get status 200 on GET /currency/list',async()=>{
        const response = await request(app)
        .get("/currency/BRL")
        expect(response.status).toBe(200)
    })

    it('should get status 200 on GET /currency/list',async()=>{
        const response = await request(app)
        .get("/currency/list")
        expect(response.status).toBe(200)
    })

    it('should get status 200 on GET /currency/transform/:from/:to/:amount',async()=>{
        const response = await request(app)
        .get("/currency/transform/BRL/EUR/20")
        expect(response.status).toBe(200)
    })

    it('should get status 400 on GET /currency/transform/:from/:to/:amount',async()=>{
        const response = await request(app)
        .get("/currency/transform/ZZY/EUR/20")
        expect(response.status).toBe(400)
    })

    it('should get status 200 on POST /currency',async()=>{
        const mock = {
            "name":"Moeda alfaya2",
            "code":"Alf2",
            "value":"200.63",
            "fictional":true
        }
        const response = await request(app)
        .post("/currency")
        .send(mock)
        expect(response.status).toBe(200)
    })

    it('should get status 400 on POST /currency',async()=>{
        const mock = {
            "name":"Moeda alfaya2",
            "code":"Alf2",
            "value":"200.63",
            "fictional":true
        }
        const response = await request(app)
        .post("/currency")
        .send(mock)
        expect(response.status).toBe(400)
    })

    it('should get status 200 on PATCH /currency/:code',async()=>{
        const response = await request(app)
        .patch("/currency/BRL")
        .send({name:"mudado"})
        expect(response.status).toBe(200)
    })

    it('should get status 400 on PATCH /currency/:code',async()=>{
        const response = await request(app)
        .patch("/currency/0")
        .send({code:"mudado"})
        expect(response.status).toBe(400)
    })

    it('should get status 200 on DELETE /currency/:code ',async()=>{
        const response = await request(app)
        .delete("/currency/BRL")
        expect(response.status).toBe(200)
    })
})
