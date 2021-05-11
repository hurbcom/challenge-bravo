const request = require("supertest")
const app = require("../../src/app")


describe('Api test',()=>{
    it('should get status 200 on /currency/:code',async()=>{
        const response = await request(app)
        .get("/currency/BRL")

        expect(response.status).toBe(200)
    })

    it('should get status 400 on /currency/:code',async()=>{
        const response = await request(app)
        .get("/currency/ZZY")
        expect(response.status).toBe(400)
    })

    it('should get status 200 on /currency/list',async()=>{
        const response = await request(app)
        .get("/currency/BRL")
        expect(response.status).toBe(200)
    })

    it('should get status 200 on /currency/list',async()=>{
        const response = await request(app)
        .get("/currency/list")
        expect(response.status).toBe(200)
    })

    it('should get status 200 on /currency/transform/:from/:to/:amount',async()=>{
        const response = await request(app)
        .get("/currency/transform/BRL/EUR/20")
        expect(response.status).toBe(200)
    })

    it('should get status 400 on /currency/transform/:from/:to/:amount',async()=>{
        const response = await request(app)
        .get("/currency/transform/ZZY/EUR/20")
        expect(response.status).toBe(400)
    })

    it('should get status 200 on /currency',async()=>{
        const mock = {
            "name":"Moeda alfaya2",
            "code":"Alf2",
            "icon":"icone",
            "value":"200.63",
            "fictional":true
        }
        const response = await request(app)
        .post("/currency")
        .send(mock)
        expect(response.status).toBe(200)
    })

    it('should get status 400 on /currency',async()=>{
        const mock = {
            "name":"Moeda alfaya2",
            "code":"Alf2",
            "icon":"icone",
            "value":"200.63",
            "fictional":true
        }
        const response = await request(app)
        .post("/currency")
        .send(mock)
        expect(response.status).toBe(400)
    })
})
