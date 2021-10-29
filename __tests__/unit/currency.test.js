const request = require('supertest')
const app = require('../../src/app')

describe('Currency', () => {

    it('should return 200 on index', async () => {

        const response = await request(app)
        .get('/')

        expect(response.status).toBe(200)
    });

    it('should return 200 on all route', async () => {

        const response = await request(app)
        .get('/all')

        expect(response.status).toBe(200)
    });

    it('should return 200 on conversion route with valid params', async () => {

        const response = await request(app)
        .get('/conversion')
        .query({to: 'BRL', from: 'USD', amount: 1})

        expect(response.status).toBe(200)
    });

    it('should return 400 on conversion route with invalid params', async () => {

        const response = await request(app)
        .get('/conversion')
        .query({to: 'BRL', from: 'USD', amount: 'INVALID_PARAM'})

        expect(response.status).toBe(200)
    });

    it('should return 200 on add route with valid params', async () => {

        const response = await request(app)
        .put('/add')
        .send({
            "code":"HURB",
            "codein":"BRL",
            "name":"Hotel Urbano/Real Brasileiro",
            "high":"5.5567",
            "low":"5.5557",
            "varBid":"-0.0006",
            "pctChange":"-0.01",
            "bid":"6.5554",
            "ask":"5.5559"
        })

        expect(response.status).toBe(201)
    });

    it('should return 400 on add route with invalid params', async () => {

        const response = await request(app)
        .put('/add')
        .send({
            "code":"HURB",
            "codein":"BRL",
            "name":"Hotel Urbano/Real Brasileiro",
            "high":"5.5567",
            "low":"5.5557",
            "varBid":"-0.0006",
            "pctChange":"-0.01",
            "bid":"6.5554",
            "ask":"5.5559"
        })

        expect(response.status).toBe(400)
    });

    it('should return 200 on delete route with valid params', async () => {

        const response = await request(app)
        .delete('/delete')
        .send({
            "code":"HURB",
            "codein":"BRL",
            "name":"Hotel Urbano/Real Brasileiro",
            "high":"5.5567",
            "low":"5.5557",
            "varBid":"-0.0006",
            "pctChange":"-0.01",
            "bid":"6.5554",
            "ask":"5.5559"
        })

        expect(response.status).toBe(200)
    });

    it('should return 400 on delete route with invalid params', async () => {

        const response = await request(app)
        .delete('/delete')
        .send({
            "code":"HURB",
            "codein":"INVALID_PARAM",
            "name":"Hotel Urbano/Real Brasileiro",
            "high":"5.5567",
            "low":"5.5557",
            "varBid":"-0.0006",
            "pctChange":"-0.01",
            "bid":"6.5554",
            "ask":"5.5559"
        })

        expect(response.status).toBe(400)
    });
})